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
import {
  Email,
  PastPlayer,
  PlayerId,
  Season,
  SeasonName,
  Team,
  TeamId,
} from '../assets/types';

// ------------------------------
// 1. USER-RELATED FETCHES
// ------------------------------

/**
 * Fetches all of the past player data
 * @returns {Array<object>} - An array of objects, where each object represents a players' profile data
 * with all the properties in that data (firstName lastName etc) id is the players email
 */

export const fetchAllPastPlayers = async (): Promise<PastPlayer[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'pastPlayers'));
    const playersData: PastPlayer[] = [];

    querySnapshot.forEach(doc => {
      const playerData = doc.data() as PastPlayer;
      playersData.push({
        ...playerData,
        id: doc.id,
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

export const fetchPastPlayerData = async (email: Email) => {
  try {
    const playerRef = doc(db, 'pastPlayers', email);
    const playerDoc = await getDoc(playerRef);

    if (playerDoc.exists()) {
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
 * @param {PlayerId} playerId - the ID of the user
 * @returns {object} - the users current data.
 */

export const fetchCurrentUserInfo = async (playerId: PlayerId) => {
  try {
    const userRef = doc(db, 'currentUsers', playerId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
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

/**
 * Fetches the current seasons not yet completed.
 * @returns {Season[]} - the users current data.
 */

export const fetchCurrentSeasons = async (): Promise<Season[]> => {
  try {
    const seasonQuery = query(
      collection(db, 'seasons'),
      where('seasonCompleted', '==', false),
    );
    const querySnapshot = await getDocs(seasonQuery);
    const seasonData: Season[] = [];

    querySnapshot.forEach(doc => {
      const newSeasonData = doc.data() as Season;
      seasonData.push({
        ...newSeasonData,
        id: doc.id,
      });
    });

    return seasonData;
  } catch (error) {
    console.error('Error fetching current unfinished seasons', error);
    throw error;
  }
};

/**
 * Fetches all the teams from the given season.
 * @param {SeasonName} seasonId - the ID of the user
 * @returns {Team[]} - the users current data.
 */

/**
 * Fetches all the teams from the given season.
 * @param {SeasonName} seasonId - The ID of the season
 * @returns {Promise<Team[]>} - A promise that resolves to an array of team objects
 */

export const fetchTeamsFromSeason = async (
  seasonId: SeasonName,
): Promise<Team[]> => {
  try {
    const seasonRef = doc(db, 'seasons', seasonId);
    const seasonDoc = await getDoc(seasonRef);
    if (seasonDoc.exists()) {
      const teamsArray = seasonDoc.data().teams;
      const teamsOutputArray: Team[] = [];

      for (const teamId of teamsArray) {
        const teamRef = doc(db, 'teams', teamId);
        const teamDoc = await getDoc(teamRef);
        if (teamDoc.exists()) {
          const teamData = teamDoc.data() as Omit<Team, 'id'>;
          teamsOutputArray.push({
            id: teamDoc.id,
            ...teamData,
          });
        }
      }

      return teamsOutputArray;
    } else {
      console.log(`${seasonId} not found in Firestore`);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching teams from ${seasonId}: `, error);
    return []; // Return an empty array in case of an error
  }
};
