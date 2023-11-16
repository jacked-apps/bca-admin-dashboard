// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Date conversion functions
//  - timestampToDate
//  - dateToTimestamp

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
//import { daysOfTheWeek } from './globalVariables';
import { Timestamp } from '@firebase/firestore';
// ------------------------------
// 1. Date Conversion Functions
// ------------------------------

/**
 * converts a JS date to a Firebase Timestamp
 * @param {Date} date - Date to convert
 * @returns {Timestamp} - The converted Firebase Timestamp
 */

export const convertDateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

/**
 * converts a Firebase Timestamp to a JS date
 * @param {Timestamp} timestamp - Date to convert
 * @returns {Date} - The converted JS Date
 */

export const convertTimestampToDate = (timestamp: Timestamp): Date => {
  return timestamp.toDate();
};
