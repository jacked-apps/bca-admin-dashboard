/ ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related posts
//    -
// 2. Season-related posts
//    - addOrUpdateSeason
// 3  Team-related posts
//    - addNewTeamToSeason

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  arrayUnion,
} from '@firebase/firestore'; // Import getFirestore from Firebase
import { db } from './firebaseConfig';
import { blankPlayerArray } from '../constants/globalVariables';

// ------------------------------
// 1. USER-RELATED POSTS
// -----------------------------

// ------------------------------
// 2. SEASON-RELATED POSTS
// ------------------------------

/**
 * Adds or updates a season in firestore
 * @param {string} seasonName - The unique name of a season used as the document ID
 * @param {object} data - The data to be stored in season document
 * @returns {Promise<void>} - A promise indicating the completion of add/update season
 */

export const addOrUpdateSeason = async (seasonName, data) => {
  try {
    // get a reference
    const seasonRef = doc(db, 'seasons', seasonName);
    // check if document exists
    const docSnap = await getDoc(seasonRef);
    if (docSnap.exists()) {
      // confirm update
      const isConfirmed = window.confirm(
        `${seasonName} already exists. Did you mean to update it?`,
      );
      // update doc
      if (isConfirmed) {
        await updateDoc(seasonRef, data);
        console.log('Season updated successfully');
      } else {
        // cancel update
        console.log('Season Update cancelled');
        return;
      }
    } else {
      // no existing season, confirm create season
      const isConfirmed = window.confirm(
        `Create a new season with the name ${seasonName}?`,
      );
      // create season
      if (isConfirmed) {
        await setDoc(seasonRef, data);
        console.log('Season added successfully');
      } else {
        // cancel create season
        console.log('Create season cancelled');
        return;
      }
    }
  } catch (error) {
    console.error('Error adding or updating season', error);
  }
};

// ------------------------------
// 2. TEAM-RELATED POSTS
// ------------------------------

/**
 * Adds a team to the teams table and adds the team id to the seasons teams array
 * @param {string} seasonName - The unique name of a season used as the document ID
 * @param {string} teamName - The unique name of a team to add to the seasonName
 * @param {object} data - The data to be stored in season document
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const addNewTeamToSeason = async (seasonName, teamName) => {
  try {
    const teamCollection = collection(db, 'teams');
    // Create new team
    const teamRef = await addDoc(teamCollection, {
      players: blankPlayerArray,
      seasonId: seasonName,
      teamName: teamName,
    });
    // Get season document ref
    const seasonRef = doc(db, 'seasons', seasonName);

    // update the season teams Array with team id
    await updateDoc(seasonRef, {
      teams: arrayUnion(teamRef.id),
    });
  } catch (error) {
    console.error('Error adding new team to season', error);
  }
};