// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season-related functions
//    - getSeason
//    - buildSeasonName
//    - getEndOfSeasonDate
//    - getDayOfWeek
//    - getHolidaysBetweenDates
//    - getHolidaysAroundDate
// 2. Team-related functions
//    - createPlayerData
// 3. Math-related functions

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import { daysOfTheWeek } from '../constants/globalVariables';
import Holidays from 'date-holidays';

// ------------------------------
// 1. SEASON-RELATED Functions
// ------------------------------

/**
 * Derives the 'SEASON' from the month
 * @param {1|2|3|4|5|6|7|8|9|10|11|12} month - The month (1 for January to 12 for December)
 * @returns {string} - 'Spring'|'Summer'|'Fall'|'Winter'
 */

export const getSeason = month => {
  if ([3, 4, 5].includes(month)) return 'Spring';
  if ([6, 7, 8].includes(month)) return 'Summer';
  if ([9, 10, 11].includes(month)) return 'Fall';
  if ([12, 1, 2].includes(month)) return 'Winter';
  throw new Error('Invalid Month');
};

/**
 * Names a season with information given
 * @param {string} game - Game being played "8 Ball" | "9 Ball"
 * @param {string} night - Night of the week, e.g., 'Tuesday'
 * @param {Date} startDate - starting date of the season
 * @returns {string} - a season name, e.g., "9 Ball Tuesday Spring 2023"
 */

export const buildSeasonName = (game, startDate) => {
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1;
  const season = getSeason(month);
  const night = getDayOfWeek(startDate);
  return `${game} ${night} ${season} ${year}`;
};

/**
 * Figures out the ending date of a season
 * @param {Date} startDate - The Starting Day Of the Season
 * @param {number} weeks - Number of regular weeks in the season, will add 2 for night off and money round
 * @returns {string} - Ending date of the season formatted to MM/DD/YYYY
 */

export const getEndOfSeasonDate = (startDate, weeks = 16) => {
  const endingDate = new Date(startDate);
  endingDate.setDate(startDate.getDate() + (weeks + 2) * 7);

  const endDate = endingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  return endDate;
};

/**
 * Figures out the of the week of date given
 * @param {Date} startDate - The Date given
 * @returns {string} - The day of the week e.g.,'Wednesday'
 */

export const getDayOfWeek = startDate => {
  const date = new Date(startDate);
  const dayName = daysOfTheWeek[date.getDay()];
  return dayName;
};

/**
 * Gets Holiday objects between 2 dates
 * @param {Date} startDate - The Starting Day
 * @param {Date} endDate - The Ending Day
 * @returns {Array<Object>} - An array of holiday objects between the 2 dates
 */

export const getHolidaysBetweenDates = (startDate, endDate) => {
  const hd = new Holidays('us');
  const startYear = startDate.getFullYear();
  const endingDate = new Date(endDate);
  const endYear = endingDate.getFullYear();
  //console.log(endDate);

  // gets all holidays of startYear and, if needed, endYear
  let allHolidays = [];
  allHolidays = allHolidays.concat(hd.getHolidays(startYear));
  if (endYear !== startYear) {
    allHolidays = allHolidays.concat(hd.getHolidays(endYear));
  }
  // filters and returns only relevant holidays between start and end dates
  return allHolidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);

    // I needed to reconstruct the dates because for some reason.
    // Just comparing them as they are was coming up false.
    // This led to returning an empty array.

    const holidayYMD = new Date(
      holidayDate.getFullYear(),
      holidayDate.getMonth(),
      holidayDate.getDate(),
    );
    const startYMD = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
    );
    const endYMD = new Date(
      endingDate.getFullYear(),
      endingDate.getMonth(),
      endingDate.getDate(),
    );
    return holidayYMD >= startYMD && holidayYMD <= endYMD;
  });
};

/**
 * Retrieves holidays that fall within a week (before and after) of a specified date
 * @param {Date} startDate - The target date
 * @returns {Array<Object>} - Array of holiday objects within a week of startDate
 */

export const getHolidaysAroundDate = startDate => {
  // calculate one week in milliseconds
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  // Determine search range
  const searchStart = new Date(startDate.getTime() - oneWeek);
  const searchEnd = new Date(startDate.getTime() + oneWeek);
  return getHolidaysBetweenDates(searchStart, searchEnd);
};

// ------------------------------
// 2. TEAM-RELATED Functions
// ------------------------------
/**
 * Takes pastPlayer object and turns it into a team.player object
 * @param {Object} player - a pastPlayer object
 * @returns {Object} - an object shaped for the team.player array
 */

export const convertToTeamPlayer = pastPlayer => {
  return {
    firstName: pastPlayer.firstName,
    lastName: pastPlayer.lastName,
    nickName: pastPlayer.nickName,
    pastPlayerId: pastPlayer.id,
    email: pastPlayer.email,
    totalWins:
      safeParseInt(pastPlayer.seasonOneWins) +
      safeParseInt(pastPlayer.seasonTwoWins) +
      safeParseInt(pastPlayer.seasonThreeWins),
    totalLosses:
      safeParseInt(pastPlayer.seasonOneLosses) +
      safeParseInt(pastPlayer.seasonTwoLosses) +
      safeParseInt(pastPlayer.seasonThreeLosses),
  };
};

// ------------------------------
// 3. MATH-RELATED Functions
// ------------------------------

/**
 * Makes sure to return a number even if it is not a valid string
 * @param {string} string - a string to change to a number
 * @returns {number} - the number derived from the string
 */

export const safeParseInt = string => {
  // take string and turn it into a base 10 number
  const number = parseInt(string, 10);
  // ensure the NAN error returns as a zero so you can still add to another number.
  return isNaN(number) ? 0 : number;
};

// ------------------------------
// 5. General Functions
// ------------------------------

/**
 * Adds a field to an object only if the provided value is defined, not null, and not an empty string.
 * @param {Object} object - The object to which the data will be added.
 * @param {string} key - The key under which the value should be added to the object.
 * @param {*} value - The value to add to the object; can be of any type except undefined, null, or an empty string.
 */
export const addFieldOnlyIfDefined = (object, key, value) => {
  if (value !== undefined && value !== null && value !== '') {
    object[key] = value;
  }
};
