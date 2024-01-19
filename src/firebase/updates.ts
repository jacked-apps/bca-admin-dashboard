// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related updates
//    - updateUserProfile
//    - updatePastPlayerProfile
// 2. Season-related updates
// 3  Team-related updates
//    - removeTeamFromSeason
//    - updateTeamData
// 4. Schedule-related updates
//    - updateSeasonSchedule
// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import {
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  //deleteField,
  //setDoc,
  //addDoc,
  //collection,
  //arrayUnion,
  arrayRemove,
} from '@firebase/firestore'; // Import getFirestore from Firebase
import { db } from '../firebaseConfig';
import {
  Email,
  PastPlayer,
  PlayerId,
  Schedule,
  SeasonName,
  Team,
  TeamId,
  TeamPlayerRole,
  TeamPlayer,
  CurrentUser,
} from '../assets/types';

// ------------------------------
// 1. USER-RELATED UPDATES
// -----------------------------

/**
 * updates the profile data of a user.
 * @param {PlayerId} userId - The Id of the user.
 * @param {PastPlayer} data - The profileData of the user.
 * @returns {Promise<void>} - A promise indicating the completion of the update
 */

export const updateUserProfile = async (
  userId: PlayerId,
  data: Partial<CurrentUser>,
) => {
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
 * @param {Email} email - the email of the player (used as ID)
 * @param {Partial<PastPlayer>} data - the new data to update
 * @returns {Promise<void>} - a promise indicating completion of the update
 */

export const updatePastPlayerProfile = async (
  email: Email,
  data: Partial<PastPlayer>,
) => {
  try {
    const playerRef = doc(db, 'pastPlayers', email);
    await updateDoc(playerRef, data);
    console.log('pastPlayer profile updated successfully');
  } catch (error) {
    console.error('Error updating pastPlayer profile', error);
  }
};

// ------------------------------
// 2. SEASON-RELATED UPDATES
// ------------------------------

// ------------------------------
// 3. TEAM-RELATED UPDATES
// ------------------------------

/**
 * Updates a team document with new information
 * @param {TeamId} teamId - The unique ID of a team to update
 * @param {Team} data - The new data NOTE: existing data will remain untouched unless specified in the data object
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const updateTeamData = async (teamId: TeamId, data: Team) => {
  try {
    // reference to the team document
    const teamRef = doc(db, 'teams', teamId);
    // remove player array from document

    // update team data
    await updateDoc(teamRef, data);
  } catch (error) {
    console.error('Error updating team', error);
  }
};

/**
 * Removes a player from a team
 * @param {TeamId} teamId - The unique ID of a team to update
 * @param {TeamPlayerRole} role - The Position the player has on the team
 * @param {TeamPlayer} playerInfo - Player info we are trying to remove
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const removePlayerFromTeam = async (
  teamId: TeamId,
  role: TeamPlayerRole,
  playerInfo: TeamPlayer,
) => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);
    if (teamDoc.exists()) {
      const teamData = teamDoc.data();
      const player = teamData.players[role];
      if (
        player.firstName === playerInfo.firstName &&
        player.lastName === playerInfo.lastName
      ) {
        console.log('remove player ', teamData);
        updateDoc(teamRef, {
          [`players.${role}`]: {
            email: '',
            firstName: '',
            lastName: '',
            nickname: '',
            pastPlayerId: '',
            totalWins: 0,
            totalLosses: 0,
          },
        });
      }
    }
  } catch (error) {
    console.error(
      `Error removing ${playerInfo.firstName} ${playerInfo.lastName} from the team`,
    );
  }
};

// ------------------------------
// 2. SCHEDULE-RELATED UPDATES
// ------------------------------

/**
 * Updates the old schedule with the given schedule
 * @param {SeasonName} seasonId - The seasons name (same as id)
 * @param {Schedule} schedule - The new schedule object
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const updateSeasonSchedule = async (
  seasonName: SeasonName,
  schedule: Schedule,
) => {
  try {
    //reference to the season document
    const seasonRef = doc(db, 'seasons', seasonName);
    await updateDoc(seasonRef, {
      schedule: schedule,
    });
  } catch (error) {
    console.error('Error updating schedule', error);
  }
};
