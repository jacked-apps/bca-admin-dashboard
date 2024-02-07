// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related creates
//    - createPastPlayer
// 2. Season-related create
//    - addOrUpdateSeason
// 3  Team-related posts
//    - addNewTeamToSeason
// 4  RoundRobin related posts
//    - saveFinishedRoundRobin

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
import { db } from '../../firebaseConfig';
import { blankPlayerObject } from '../globalVariables';
import {
  PastPlayer,
  RoundRobinScheduleFinished,
  Season,
  SeasonName,
  TeamName,
} from '../assets/types';
import { generateNickname } from '../globalFunctions';
import { Reads } from './firebaseFunctions';
import { toast } from 'react-toastify';

import {
  failedCreate,
  tryAgain,
  createSuccess,
  updateSuccess,
  failedUpdate,
} from '../../firebase/firebaseConsts';

// ------------------------------
// 1. USER-RELATED POSTS
// ------------------------------

/**
 * Creates a pastPlayer with the minimum required data.
 * @param pastPlayer - The profileData of the user.
 * @returns {Promise<void>} Promise resolving to the created pastPlayer
 */

export const createPastPlayer = async (pastPlayer: PastPlayer) => {
  let message = '';
  if (
    !pastPlayer.email ||
    !pastPlayer.firstName ||
    !pastPlayer.lastName ||
    !pastPlayer.phone
  ) {
    console.error(
      'Past Player must have a first name, last name, email, and  phone number',
      tryAgain,
    );
    message = `Past Player must have a first name, last name, email, and  phone number${tryAgain}`;
    return { success: false, message };
  }

  try {
    // check for duplicate email
    const existingDoc = await Reads.fetchPastPlayerData(pastPlayer.email);
    console.log(existingDoc);
    if (existingDoc) {
      console.log('Email already in use.');
      const message = `${failedCreate} Player - Email already in use. ${tryAgain}`;
      return { success: false, message };
    }
    const playerRef = doc(db, 'pastPlayers', pastPlayer.email);
    await setDoc(playerRef, {
      firstName: pastPlayer.firstName,
      lastName: pastPlayer.lastName,
      nickname:
        pastPlayer.nickname ||
        generateNickname(pastPlayer.firstName, pastPlayer.lastName),
      email: pastPlayer.email.toLowerCase(),
      phone: pastPlayer.phone,
      address: pastPlayer.address || '',
      city: pastPlayer.city || '',
      state: pastPlayer.state || '',
      zip: pastPlayer.zip || '',
      stats: pastPlayer.stats || {},
      teams: pastPlayer.teams || [],
      seasons: pastPlayer.seasons || [],
      currentUserId: pastPlayer.currentUserId || '',
      dob: pastPlayer.dob || '',
      id: pastPlayer.id.toLowerCase() || pastPlayer.email.toLowerCase(),
    });
    message = `Past Player ${createSuccess}`;
    console.log(message);
    return { success: true, message };
  } catch (err) {
    message = failedCreate + ' pastPlayer';
    console.error(message, err);
    return { success: false, message };
  }
};
// ------------------------------
// 2. SEASON-RELATED POSTS
// ------------------------------

/**
 * Adds or updates a season in firestore
 * @param {SeasonName} seasonName - The unique name of a season used as the document ID
 * @param {Season} data - The data to be stored in season document
 * @returns {Promise<void>} - A promise indicating the completion of add/update season
 */

export const addOrUpdateSeason = async (
  seasonName: SeasonName,
  data: Season,
) => {
  let message = '';
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
        message = 'Season' + updateSuccess;
        console.log(message);
        return { success: true, message };
      } else {
        // cancel update
        message = 'Season Update cancelled';
        console.log(message);
        return { success: false, message };
      }
    } else {
      // no existing season, confirm create season
      const isConfirmed = window.confirm(
        `Create a new season with the name ${seasonName}?`,
      );
      // create season
      if (isConfirmed) {
        await setDoc(seasonRef, data);
        message = 'Season' + createSuccess;
        console.log(message);
        return { success: true, message };
      } else {
        // cancel create season
        message = 'Create season cancelled';
        console.log(message);
        return { success: false, message };
      }
    }
  } catch (error) {
    message = failedCreate + 'or ' + failedUpdate + 'Season';
    console.error(message, error);
    return { success: false, message };
  }
};

// ------------------------------
// 3. TEAM-RELATED POSTS
// ------------------------------

/**
 * Adds a team to the teams table and adds the team id to the seasons teams array
 * @param {SeasonName} seasonName - The unique name of a season used as the document ID
 * @param {TeamName} teamName - The unique name of a team to add to the seasonName
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const addNewTeamToSeason = async (
  seasonName: SeasonName,
  teamName: TeamName,
) => {
  let message = '';
  try {
    const teamCollection = collection(db, 'teams');
    // Create new team
    const teamRef = await addDoc(teamCollection, {
      players: blankPlayerObject,
      seasonId: seasonName,
      teamName: teamName,
    });
    // Get season document ref
    const seasonRef = doc(db, 'seasons', seasonName);

    // update the season teams Array with team id
    await updateDoc(seasonRef, {
      teams: arrayUnion(teamRef.id),
    });
    message = 'Successfully added Team to Season';
    return { success: true, message };
  } catch (error) {
    message = failedCreate + 'Team in Season';
    console.error(message, error);
    return { success: false, message };
  }
};
// ------------------------------
// 4. FINISHED ROUND ROBIN-RELATED POSTS
// ------------------------------

/**
 * Adds a Finished Round Robin schedule to the finishedRoundRobins collection
 * @param {SeasonName} seasonName - The unique name of a season used as the document ID
 * @param {RoundRobinScheduleFinished} finishedRoundRobin - The Round Robin Schedule with team names inserted to save to the database
 * @returns {Promise<void>} - A promise indicating the completion of adding the Finished Round Robin Schedule
 */

export const addFinishedRoundRobin = async (
  seasonName: SeasonName,
  finishedRoundRobin: RoundRobinScheduleFinished,
) => {
  let message = '';
  try {
    const finishedRRRef = doc(db, 'finishedRoundRobinSchedules', seasonName);
    await setDoc(finishedRRRef, {
      finishedSchedule: finishedRoundRobin,
    });
    message = `Finished Round Robin Schedule in ${seasonName} ${createSuccess}`;
    console.log(message);
    return { success: true, message };
  } catch (error) {
    message = failedCreate + 'Round Robin Schedule';
    console.error(message, error);
    return { success: false, message };
  }
};
