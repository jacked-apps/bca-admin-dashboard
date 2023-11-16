/ ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related updates
//    - updateUserProfile
//    - updatePastPlayerProfile
// 2. Season-related updates
// 3  Team-related updates
//    - removeTeamFromSeason
//    - updateTeamData

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  deleteField,
  //setDoc,
  //addDoc,
  //collection,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore'; // Import getFirestore from Firebase
import { db } from './firebaseConfig';
//import { blankPlayerArray } from '../constants/globalVariables';

// ------------------------------
// 1. USER-RELATED UPDATES
// -----------------------------

/**
 * updates the profile data of a user.
 * @param {string} userId - The Id of the user.
 * @param {object} data - The profileData of the user.
 * @returns {Promise<void>} - A promise indicating the completion of the update
 */

export const updateUserProfile = async (userId, data) => {
  try {
    const userRef = doc(db, 'currentUsers', userId);
    await updateDoc(userRef, data);
    console.log('User profile updated successfully');
  } catch (error) {
    console.error('Error updating user profile', error);
  }
};

/**
 * Updates the profile data of a pastPlayer
 * @param {string} email - the email of the player (used as ID)
 * @param {object} data - the new data to update
 * @returns {Promise<void>} - a promise indicating completion of the update
 */

export const updatePastPlayerProfile = async (email, data) => {
  try {
    const playerRef = doc(db, 'pastPlayers', email);
    await updateDoc(playerRef, data);
    console.log('pastPlayer profile updated successfully');
  } catch (error) {
    console.error('Error updating pastPlayer profile', error);
  }
};

// ------------------------------
// 2. SEASON-RELATED POSTS
// ------------------------------

// ------------------------------
// 2. TEAM-RELATED POSTS
// ------------------------------

/**
 * Removes a team from the teams table and removes the team id from the seasons teams array
 * @param {string} seasonName - The unique name of a season used as the document ID
 * @param {string} teamId - The unique ID of a team to remove to the seasonName
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const removeTeamFromSeason = async (seasonName, teamId) => {
  try {
    //reference to the season document
    const seasonRef = doc(db, 'seasons', seasonName);

    // remove the teamId from the teams array
    await updateDoc(seasonRef, {
      teams: arrayRemove(teamId),
    });

    //reference to the team document
    const teamRef = doc(db, 'teams', teamId);

    // remove the team document from the teams collection
    await deleteDoc(teamRef);
    console.log('Successfully removed team from season and deleted team');
  } catch (error) {
    console.error(`Error removing team from ${seasonName}`, error);
  }
};

/**
 * Updates a team document with new information
 * @param {string} teamId - The unique ID of a team to update
 * @param {Object} data - The new data NOTE: existing data will remain untouched unless specified in the data object
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const updateTeamData = async (teamId, data) => {
  try {
    console.log('UPDATE TEAM', teamId, data.players);
    // reference to the team document
    const teamRef = doc(db, 'teams', teamId);
    // remove player array from document

    // update team data
    await updateDoc(teamRef, data);
  } catch (error) {
    console.error('Error updating team', error);
  }
};