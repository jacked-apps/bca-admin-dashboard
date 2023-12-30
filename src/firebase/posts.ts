// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related posts
//    -
// 2. Season-related posts
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
import { db } from '../firebaseConfig';
import { blankPlayerObject } from '../assets/globalVariables';
import {
  RoundRobinScheduleFinished,
  Season,
  SeasonName,
  TeamName,
} from '../assets/types';
// ------------------------------
// 1. USER-RELATED POSTS
// -----------------------------

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
  } catch (error) {
    console.error('Error adding new team to season', error);
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
  try {
    const finishedRRRef = doc(db, 'finishedRoundRobinSchedules', seasonName);
    await setDoc(finishedRRRef, {
      finishedSchedule: finishedRoundRobin,
    });

    console.log(`Finished round robin schedule added to ${seasonName}`);
  } catch (error) {
    console.error('Error adding finished round robin schedule', error);
  }
};
