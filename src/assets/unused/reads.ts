// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related reads
//    - fetchAllPastPlayers
//    - fetchPastPlayerData
//    - fetchCurrentUserInfo
//    - fetchAllCurrentUsers
// 2. Round Robin-related reads
//    - fetchRoundRobinSchedule
//    - fetchFinishedRoundRobinSchedule
// 3. Team-related reads
//    - fetchTeamById
//    - fetchTeamsFromSeason
// 4. Season-related reads
//    -fetchCurrentSeasons

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
import { db } from '../../firebaseConfig';
import {
  Email,
  PastPlayer,
  ActivePlayer,
  PlayerId,
  RoundRobinSchedule,
  RoundRobinScheduleFinished,
  Season,
  SeasonName,
  Team,
  CurrentUser,
  //TeamId,
} from '../assets/types';
import {
  failedFetch,
  fromStore,
  notFound,
} from '../../firebase/firebaseConsts';

// ------------------------------
// 1. USER-RELATED READS
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
    console.error(failedFetch, 'all Past Players', fromStore, error);
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
      console.log('Player', notFound);
      return null;
    }
  } catch (error) {
    console.error(failedFetch, 'Player profile data', fromStore, error);
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
      console.log('User', notFound);
      return null;
    }
  } catch (error) {
    console.error(failedFetch, 'Current User data', fromStore, error);
    throw error;
  }
};

/**
 * Fetches all of the current user data
 * @returns {Array<object>} - An array of objects, where each object represents a current users' profile data
 * with all the properties in that data (firstName lastName etc)
 */

export const fetchAllCurrentUsers = async (): Promise<CurrentUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'currentUsers'));
    const playersData: CurrentUser[] = [];

    querySnapshot.forEach(doc => {
      const playerData = doc.data() as CurrentUser;
      playersData.push({
        ...playerData,
        id: doc.id,
      });
    });

    return playersData;
  } catch (error) {
    console.error(failedFetch, 'all Current Users.', fromStore, error);
    throw error;
  }
};

/**
 * Fetches documents from currentUsers where a given field matches with a searchString
 * @param {string} fieldName - The name of the filed to search
 * @param {string} searchString - The string to match in specified field
 * @returns {Promise<Array>} - An array of matching documents
 */

export const fetchCurrentUserBySearchField = async (
  fieldName: string,
  searchString: string,
): Promise<CurrentUser[]> => {
  try {
    const myQuery = query(
      collection(db, 'currentUsers'),
      where(fieldName, '==', searchString),
    );
    const querySnapshot = await getDocs(myQuery);
    const results: CurrentUser[] = [];

    querySnapshot.forEach(doc => {
      const data = doc.data() as Omit<CurrentUser, 'id'>;
      results.push({ id: doc.id, ...data });
    });
    return results;
  } catch (error) {
    console.error(failedFetch, 'Current User documents requested', fromStore);
    return [];
  }
};

// ------------------------------
// 2. ROUND ROBIN SCHEDULE RELATED READS
// ------------------------------

/**
 * Fetches the round-robin schedule for the specified number of teams.
 * @param {number} numberOfTeams - The number of teams in the season
 * @returns {Promise<RoundRobinSchedule>}
 */

export const fetchRoundRobinSchedule = async (
  numberOfTeams: number,
): Promise<RoundRobinSchedule> => {
  if (numberOfTeams < 4) {
    numberOfTeams = 4;
  }
  try {
    const scheduleName = `scheduleFor${numberOfTeams}Teams`;
    const scheduleRef = doc(db, 'roundRobinSchedules', scheduleName);
    const scheduleDoc = await getDoc(scheduleRef);

    if (scheduleDoc.exists()) {
      return scheduleDoc.data() as RoundRobinSchedule;
    } else {
      console.log(scheduleName, notFound);
      return {};
    }
  } catch (error) {
    console.error(
      `${failedFetch} Round Robin Schedule for ${numberOfTeams} teams`,
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
      console.log(`Finished Round Robin Schedule for ${seasonId} ${notFound}`);
      return null;
    }
  } catch (error) {
    console.error(`${failedFetch} Finished Round Robin for ${seasonId}`);
    throw error;
  }
};

// ------------------------------
// 3. TEAM RELATED READS
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
      console.log('Team', notFound);
      return null;
    }
  } catch (error) {
    console.error(failedFetch, 'Team data', fromStore, error);
    throw error;
  }
};

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
      console.log(seasonId, notFound);
      return [];
    }
  } catch (error) {
    console.error(`${failedFetch} Teams from ${seasonId}: `, error);
    return []; // Return an empty array in case of an error
  }
};
// ------------------------------
// 4. SEASON RELATED READS
// ------------------------------

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
    console.error(failedFetch, 'Current unfinished Seasons', fromStore, error);
    throw error;
  }
};
