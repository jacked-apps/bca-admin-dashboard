// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related fetches
//    - fetchAllPastPlayers
//    - fetchPastPlayerData
//    - fetchCurrentUserInfo
// 2. Next fetch type

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
//import { getFirestore, collection, doc, getDoc } from '@firebase/firestore'; // Import getFirestore from Firebase
//import { app, db } from '../../firebaseConfig';
//const firestore = getFirestore(app);
import {
  doc,
  getDoc,
  getDocs,
  collection,
  query,
  where,
} from '@firebase/firestore';
import { db } from '../firebaseConfig';

// ------------------------------
// 1. USER-RELATED FETCHES
// ------------------------------

/**
 * Fetches all of the past player data
 * @returns {Array<object>} - An array of objects, where each object represents a players' profile data
 * with all the properties in that data (firstName lastName etc) id is the players email
 */
export const fetchAllPastPlayers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pastPlayers'));
    const playersData = [];

    querySnapshot.forEach(doc => {
      playersData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return playersData;
  } catch (error) {
    console.error('Error fetching all past player data', error);
    throw error;
  }
};

/**
 * Fetches the profile data of a user.
 * @param {string} email - The email of the user.
 * @returns {Object} - The user's profile data.
 */

export const fetchPastPlayerData = async email => {
  try {
    const playerRef = doc(db, 'pastPlayers', email);
    const playerDoc = await getDoc(playerRef);

    if (playerDoc.exists) {
      const playerData = playerDoc.data();
      //console.log('Player Profile Data:', playerData); // Log the retrieved player data
      return playerData;
    } else {
      console.log('Player not found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error fetching player profile data:', error);
    throw error; // Handle the error appropriately in your application
  }
};

/**
 * Fetches the current user data using the users UID.
 * @param {string} userId - the ID of the user
 * @returns {object} - the users current data.
 */
export const fetchCurrentUserInfo = async userId => {
  try {
    const userRef = doc(db, 'currentUsers', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('Current User Info Fetch', userData);
      return userData;
    } else {
      console.log('User not found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error fetching current user data: ', error);
    throw error;
  }
};

export const fetchCurrentSeasons = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'seasons').where('seasonCompleted', '==', false),
    );
    const seasonData = [];

    querySnapshot.forEach(doc => {
      seasonData.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return seasonData;
  } catch (error) {
    console.error('Error fetching all past player data', error);
    throw error;
  }
};
export const fetchTeamsFromSeason = async (seasonId: string) => {
  try {
    // fetch the teamArray from the season
    const seasonRef = doc(db, 'seasons', seasonId);
    const seasonDoc = await getDoc(seasonRef);
    if (seasonDoc.exists()) {
      // fetch the teams from the teamArray
      const teamsArray = seasonDoc.data().teams;
      const teamQuery = query(
        collection(db, 'teams'),
        where('teamId', 'in', teamsArray),
      );
      const querySnapshot = await getDocs(teamQuery);
      // create the teamArray to output and return it
      const teamsOutputArray: Team[] = [];
      querySnapshot.forEach(doc => {
        teamsOutputArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return teamsOutputArray;
    } else {
      console.log(`${seasonId} not found in firestore`);
    }
  } catch (error) {
    console.error(`Error fetching teams from ${seasonId}: `, error);
  }
};

////i said this one works!

export const fetchTeamsFromSeasonWorking = async (seasonId: string) => {
  try {
    const seasonRef = doc(db, 'seasons', seasonId);
    const seasonDoc = await getDoc(seasonRef);
    if (seasonDoc.exists()) {
      const teamsArray = seasonDoc.data().teams;
      const teamsOutputArray = [];

      for (const teamId of teamsArray) {
        const teamRef = doc(db, 'teams', teamId);
        const teamDoc = await getDoc(teamRef);
        if (teamDoc.exists()) {
          teamsOutputArray.push({
            id: teamDoc.id,
            ...teamDoc.data(),
          });
        }
      }

      return teamsOutputArray;
    } else {
      console.log(`${seasonId} not found in firestore`);
    }
  } catch (error) {
    console.error(`Error fetching teams from ${seasonId}: `, error);
  }
};
