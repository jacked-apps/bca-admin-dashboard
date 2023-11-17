// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Date conversion functions
//  - timestampToDate
//  - dateToTimestamp
//  - toJSDate
//  - readableDate

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
//import { daysOfTheWeek } from './globalVariables';
import { Timestamp } from '@firebase/firestore';
import { TimeOfYear, DateFormat } from './types';
// ------------------------------
// 1. Date Conversion Functions
// ------------------------------

/**
 * converts a JS date to a Firebase Timestamp
 * @param {Date} date - Date to convert
 * @returns {Timestamp} - The converted Firebase Timestamp
 */

export const convertDateToTimestamp = (
  date: Date | undefined,
): Timestamp | 'Invalid Date' => {
  if (date === undefined) {
    return 'Invalid Date';
  }
  const jsDate = toJSDate(date);
  if (jsDate === 'Invalid Date') {
    return 'Invalid Date';
  }

  if (!date) {
    throw new Error('Invalid date provided to convertDateToTimestamp');
  }
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
/**
 * Converts a Date, string, or Timestamp to a JS Date object
 * @param {Date | string | Timestamp} date - The date to convert
 * @returns {Date} - The converted JS Date object
 */
export const toJSDate = (
  date: Date | string | Timestamp,
): Date | 'Invalid Date' => {
  if (date instanceof Date) {
    return date;
  } else if (typeof date === 'string') {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return 'Invalid Date';
    }
    return parsedDate;
  } else if (date instanceof Timestamp) {
    return date.toDate();
  } else {
    return 'Invalid Date';
  }
};

/**
 * converts a Date to a readable string
 * @param {Date | Timestamp | string} date - Date to convert
 * @param {DateFormat} format - Date to convert
 * @returns {string} - The date in the format requested
 */
export const readableDate = (
  date: Date | string | Timestamp,
  format: DateFormat = 'short',
): string => {
  const jsDate = toJSDate(date);
  return jsDate === 'Invalid Date'
    ? 'Invalid Date'
    : jsDate.toLocaleString('en-US', {
        year: 'numeric',
        month: format,
        day: 'numeric',
      });
};

export const getTimeOfYear = (date: Date): TimeOfYear | 'Invalid Date' => {
  const jsDate = toJSDate(date);
  if (jsDate === 'Invalid Date') {
    return 'Invalid Date';
  }
  const month = date.getMonth();

  if (month >= 2 && month <= 4) {
    return 'Spring';
  } else if (month >= 5 && month <= 7) {
    return 'Summer';
  } else if (month >= 8 && month <= 10) {
    return 'Fall';
  } else {
    return 'Winter';
  }
};
