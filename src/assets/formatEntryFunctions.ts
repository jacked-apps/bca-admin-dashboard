// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Capitalization
//  - capitalizeString
//  - capitalizeField
// 2. Phone Number

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------

// ------------------------------
// 1. Capitalization
// ------------------------------

/**
 * Capitalizes the first character of the given string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalizeString = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Capitalizes the first character of each word in the given address string.
 *
 * @param address - The address string to capitalize.
 * @returns The capitalized address string.
 */
export const capitalizeField = (address: string): string => {
  return address.split(' ').map(capitalizeString).join(' ');
};

// ------------------------------
// 2. Phone Number
// ------------------------------

export const formatPhoneNumber = (phoneNumber: string): string => {
  //remove spaces or dashes from the phone number
  const formattedPhoneNumber = phoneNumber.replace(/[-\s]/g, '');
  // get first 3 digits
  const firstThreeDigits = formattedPhoneNumber.slice(0, 3);
  const secondThreeDigits = formattedPhoneNumber.slice(3, 6);
  const lastFourDigits = formattedPhoneNumber.slice(6, 10);
  // return string format ### ### ####
  return `${firstThreeDigits} ${secondThreeDigits} ${lastFourDigits}`;
};
