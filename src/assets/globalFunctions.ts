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
// import Holidays from 'date-holidays';
import { Game, PoolHall } from './types';
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
