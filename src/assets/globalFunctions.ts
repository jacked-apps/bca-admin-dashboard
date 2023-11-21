// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season-related functions
//    - buildSeasonName
// 2. Holiday-related functions
//    - fetchHolidays
//    - createHolidayObject
//    - getHolidaysAroundDate

// 3. Team-related functions
//    - convertPastPlayerToTeamPlayer
//    - createPlayerData
// 4. Helper Functions
// 5. Schedule-related functions

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import { Timestamp } from 'firebase/firestore';
import { daysOfTheWeek, notDate } from './globalVariables';
import { getTimeOfYear, readableDate, toJSDate } from './dateFunctions';
import Holidays from 'date-holidays';
import {
  Game,
  Holiday,
  PoolHall,
  DateOrStamp,
  PastPlayer,
  TeamPlayerRole,
  TeamPlayerInfo,
  TeamPlayer,
  Schedule,
} from './types';

// ------------------------------
// 1. SEASON-RELATED Functions
// ------------------------------

/**
 * Names a season with information given
 * @param {Game} game - Game being played "8 Ball" | "9 Ball" | "10 Ball"
 * @param {DayOfWeek} night - Night of the week, e.g., 'Tuesday'
 * @param {PoolHall} poolHall - the Pool Hall hosting the league e.g. 'Billiards Plaza'
 * @param {Date|Timestamp} startDate - starting date of the season
 * @returns {string} - a season name, e.g., "9 Ball Tuesday Spring 2023 Billiards Plaza"
 */

export const buildSeasonName = (
  startDate: Timestamp | Date | string,
  poolHall?: PoolHall,
  game?: Game,
) => {
  const date = toJSDate(startDate);
  if (date === notDate) {
    return 'No Season Name Yet';
  }

  const year = date.getFullYear();
  const season = getTimeOfYear(date);
  const night = daysOfTheWeek[date.getDay()];
  return `${game ? game : 'X Ball'} ${night} ${season} ${year} ${
    poolHall ? poolHall : 'No Pool Hall'
  }`;
};

/**
 * Calculates the end date of a season
 * @param {Date | Timestamp | NotDate} startDate - starting date of the season
 * @returns {Date} - a season name, e.g., "9 Ball Tuesday Spring 2023 Billiards Plaza"
 */

// ------------------------------
// 2. HOLIDAY-RELATED Functions
// ------------------------------

const SEASON_LENGTH_WEEKS = 18;
const ADDITIONAL_WEEKS = 8;

/**
 * Fetches holidays for a given season.
 * @param {Date} startDate - The start date of the season.
 * @returns {Holiday[]} - A promise that resolves to an array of holidays.
 */
export const fetchHolidays = (startDate: Date | Timestamp | string) => {
  const jsDate = toJSDate(startDate);
  if (jsDate === notDate) {
    return [];
  }
  const hd = new Holidays();
  hd.init('US'); // adjust the country code as needed

  const start = new Date(jsDate);
  start.setDate(start.getDate() - 7); // start a week earlier

  const end = new Date(jsDate);
  end.setDate(end.getDate() + (SEASON_LENGTH_WEEKS + ADDITIONAL_WEEKS) * 7); // extend to cover the entire season plus buffer

  const yearStart = start.getFullYear();
  const yearEnd = end.getFullYear();

  const holidays = [];
  for (let year = yearStart; year <= yearEnd; year++) {
    holidays.push(...hd.getHolidays(year));
  }

  return holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
};

/**
 * Creates a holiday object in the shape of Holiday.
 * @param {DateOrStamp} startDate - The start date of the holiday/event.
 * @param {DateOrStamp} endDate - The end date of the holiday/event.
 * @param {string} type - either bca or apa to create that event.
 * @returns {Holiday} - A holiday object.
 */

export const createHolidayObject = (
  startDate: DateOrStamp,
  endDate: DateOrStamp,
  type: 'bca' | 'apa',
): Holiday => {
  const name = `${type.toUpperCase()} National Championships`;
  const object = {
    date: readableDate(startDate),
    name: name,
    start: startDate,
    end: endDate,
    rule: 'Take these weeks off league to allow players to go to these events',
    type: 'event',
  };
  return object;
};

// ------------------------------
// 3. TEAM-RELATED Functions
// ------------------------------
/**
 * Converts a pastPlayer object to a teamPlayerObject and assigns it to the specified role.
 * @param {PastPlayer} pastPlayer - A pastPlayer's data to be converted
 * @param {TeamPlayerRole} role - The role (e.g., 'captain', 'player2') that the player will assume in the team.
 * @returns {TeamPlayer} - An object with a single key-value pair, where the key is the team role and the value is the TeamPlayerInfo
 */

export const convertPastPlayerToTeamPlayer = (
  pastPlayer: PastPlayer,
): TeamPlayerInfo => {
  const teamPlayerInfo: Partial<TeamPlayerInfo> = {};

  addFieldIfDefined(teamPlayerInfo, 'firstName', pastPlayer.firstName);
  addFieldIfDefined(teamPlayerInfo, 'lastName', pastPlayer.lastName);
  addFieldIfDefined(teamPlayerInfo, 'nickname', pastPlayer.nickname);
  addFieldIfDefined(teamPlayerInfo, 'currentUserId', pastPlayer.currentUserId);
  addFieldIfDefined(teamPlayerInfo, 'pastPlayerId', pastPlayer.id);
  addFieldIfDefined(teamPlayerInfo, 'email', pastPlayer.email);

  const totalWins =
    safeParseInt(pastPlayer.seasonOneWins) +
    safeParseInt(pastPlayer.seasonTwoWins) +
    safeParseInt(pastPlayer.seasonThreeWins);
  const totalLosses =
    safeParseInt(pastPlayer.seasonOneLosses) +
    safeParseInt(pastPlayer.seasonTwoLosses) +
    safeParseInt(pastPlayer.seasonThreeLosses);

  addFieldIfDefined(teamPlayerInfo, 'totalWins', totalWins);
  addFieldIfDefined(teamPlayerInfo, 'totalLosses', totalLosses);

  return teamPlayerInfo as TeamPlayerInfo;
};

// ------------------------------
// 4. HELPER Functions
// ------------------------------

/**
 * Takes in a number string and returns a number invalid number strings return 0
 * @param {string | undefined} startDate - The number string e.g. '55'
 * @returns {number} - The number string as a number, invalid number strings or undefined returns zero
 */

export const safeParseInt = (value: string | undefined): number => {
  return parseInt(value ?? '0', 10) || 0;
};

/**
 * Will only add a field if that field is defined
 * @param {T} object - The object of type T to which to  the key/value pair is added
 * @param {k} key - The key to add, where K is a keyof T.
 * @param {T[K] | undefined} value - The value for that key, which must be of the same type as object[key]
 */

export const addFieldIfDefined = <T, K extends keyof T>(
  object: T,
  key: K,
  value: T[K] | undefined,
) => {
  if (value !== undefined && value !== null && value !== '') {
    object[key] = value;
  }
};

// ------------------------------
// 4. Schedule-Related Functions
// ------------------------------

/**
 * Creates a basic schedule for a pool season
 * This function initializes the schedule starting from the startDate
 * It creates entries for each week, plus season break and money round
 * the user can alter the usual 16 week season if they wish
 * @param {Date} startDate - The starting day of the season to make the schedule for
 * @param {number} [seasonLength = 16 ] Optional. The the length of the season
 * @param {Schedule} basicSchedule - The the basic schedule for the league.
 */

export const createBasicSchedule = (
  startDate: Date,
  seasonLength: number = 16,
): Schedule => {
  const basicSchedule: Schedule = {};
  const currentDate = new Date(startDate.getTime());

  for (let week = 1; week <= seasonLength; week++) {
    const dateKey = readableDate(currentDate);
    basicSchedule[dateKey] = {
      title: `Week ${week}`,
      leaguePlay: true,
      matchUps: 'placeholder-matchupId',
    };
    currentDate.setDate(currentDate.getDate() + 7);
  }
  basicSchedule[readableDate(currentDate)] = {
    title: 'Season Break',
    leaguePlay: false,
    matchUps: 'placeholder-matchupId',
  };
  currentDate.setDate(currentDate.getDate() + 7);
  basicSchedule[readableDate(currentDate)] = {
    title: 'Money Round',
    leaguePlay: true,
    matchUps: 'placeholder-matchupId',
  };
  return basicSchedule;
};
