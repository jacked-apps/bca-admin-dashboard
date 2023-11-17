// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season-related functions
//
//    - buildSeasonName
//    - getEndOfSeasonDate
//
//    - getHolidaysBetweenDates
//    - getHolidaysAroundDate
// 2. Team-related functions
//    - createPlayerData
// 3. Math-related functions

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import { daysOfTheWeek } from './globalVariables';
import Holidays from 'date-holidays';
import { Game, Holiday, PoolHall } from './types';
import { Timestamp } from 'firebase/firestore';
import { getTimeOfYear, toJSDate } from './dateFunctions';

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
  if (date === 'Invalid Date') {
    return 'No Season Name Yet';
  }

  const year = date.getFullYear();
  const season = getTimeOfYear(date);
  const night = daysOfTheWeek[date.getDay()];
  return `${game ? game : 'X Ball'} ${night} ${season} ${year} ${
    poolHall ? poolHall : 'No Pool Hall'
  }`;
};

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
  if (jsDate === 'Invalid Date') {
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
