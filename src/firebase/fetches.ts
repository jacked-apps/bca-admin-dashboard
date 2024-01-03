// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related fetches
//    - fetchAllPastPlayers
//    - fetchPastPlayerData
//    - fetchCurrentUserInfo
// 2. Round Robin-related fetches
//    - fetchRoundRobinSchedule
//    - fetchFinishedRoundRobinSchedule
// 3. Team-related fetches
//    - fetchTeamById
// 4. xxx-related fetches

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
  RoundRobinSchedule,
  RoundRobinScheduleFinished,
  Season,
  SeasonName,
  Team,
  //TeamId,
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

// ------------------------------
// 2. ROUND ROBIN SCHEDULE RELATED FETCHES
// ------------------------------

/**
 * Fetches the round-robin schedule for the specified number of teams.
 * @param {number} numberOfTeams - The number of teams in the season
 * @returns {Promise<RoundRobinSchedule>}
 */

export const fetchRoundRobinSchedule = async (
  numberOfTeams: number,
): Promise<RoundRobinSchedule> => {
  try {
    const scheduleName = `scheduleFor${numberOfTeams}Teams`;
    const scheduleRef = doc(db, 'roundRobinSchedules', scheduleName);
    const scheduleDoc = await getDoc(scheduleRef);

    if (scheduleDoc.exists()) {
      return scheduleDoc.data() as RoundRobinSchedule;
    } else {
      console.log(`${scheduleName} not found in Firestore`);
      return {};
    }
  } catch (error) {
    console.error(
      `Error fetching round robin schedule for ${numberOfTeams} teams: `,
      error,
    );
    throw error;
  }
};

/**
 * Fetches the Finished Round Robin Schedule using the season ID.
 * @param {SeasonName} seasonId - the ID of the season
 * @returns {Promise<RoundRobinScheduleFinished | null> } - the team data.
 */

export const fetchFinishedRoundRobinSchedule = async (
  seasonId: SeasonName,
): Promise<RoundRobinScheduleFinished | null> => {
  try {
    // create ref
    const scheduleRef = doc(db, 'finishedRoundRobinSchedules', seasonId);
    // fetch the document
    const scheduleDoc = await getDoc(scheduleRef);
    if (scheduleDoc.exists()) {
      //if document is there return the data
      const finishedSchedule = scheduleDoc.data();
      return finishedSchedule.finishedSchedule as RoundRobinScheduleFinished;
    } else {
      // handle errors
      console.log(
        `Finished round robin schedule for ${seasonId} not found in Firestore`,
      );
      return null;
    }
  } catch (error) {
    console.error(`Error fetching finished round robin for ${seasonId}`);
    throw error;
  }
};

// ------------------------------
// 3. TEAM RELATED FETCHES
// ------------------------------

/**
 * Fetches the Team data using the team ID.
 * @param {string} teamId - the ID of the user
 * @returns {Promise<Team | null> } - the team data.
 */

export const fetchTeamById = async (teamId: string): Promise<Team | null> => {
  try {
    const teamRef = doc(db, 'teams', teamId);
    const teamDoc = await getDoc(teamRef);

    if (teamDoc.exists()) {
      const teamData = teamDoc.data() as Team;
      teamData.id = teamDoc.id;
      return teamData;
    } else {
      console.log('Team not found in Firestore');
      return null;
    }
  } catch (error) {
    console.error('Error fetching team data: ', error);
    throw error;
  }
};

// ------------------------------
// 4. xxx RELATED FETCHES
// ------------------------------
