// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season-related fetches
//    - useFetchSeasons
// 2. Team-related fetches
//    - useFetchTeamData
//    - useFetchTeams
// 3. Player-related fetches
//    - updateSeasonSchedule

//------------------------
// IMPORTS
//------------------------
import { useQuery } from 'react-query';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from '@firebase/firestore';
import {
  CurrentUser,
  Email,
  PastPlayer,
  Season,
  SeasonName,
  Team,
} from '../assets/types';

// ------------------------------
// 1. SEASON-RELATED FETCHES
// ------------------------------

/**
 * Fetches all seasons from Firestore where seasonCompleted = false.
 *
 * Queries seasons collection filtered by seasonCompleted field.
 * Maps results to Season objects by extracting id and data.
 *
 * Returns Promise resolving to array of Season objects.
 */
const fetchSeasonsRQ = async (): Promise<Season[]> => {
  const seasonQuery = query(
    collection(db, 'seasons'),
    where('seasonCompleted', '==', false),
  );
  const querySnapshot = await getDocs(seasonQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Season, 'id'>),
  }));
};

export const useFetchSeasons = () => {
  return useQuery('currentSeasons', fetchSeasonsRQ);
};

/**
 * Fetches a season by name/id from Firestore.
 *
 * Takes a season name/id string.
 * Gets the season document reference by name.
 * Fetches the season document snapshot.
 * If found, returns a Season object from the snapshot data.
 * If not found, throws an error.
 */

const fetchSeasonRQ = async (
  seasonName: SeasonName | undefined,
): Promise<Season> => {
  if (seasonName === undefined) {
    throw new Error('Season name/id not provided');
  }
  const seasonDoc = doc(db, 'seasons', seasonName);
  const seasonDocSnapshot = await getDoc(seasonDoc);
  if (seasonDocSnapshot.exists()) {
    return {
      id: seasonDocSnapshot.id,
      ...(seasonDocSnapshot.data() as Omit<Season, 'id'>),
    };
  } else {
    throw new Error('Season not found');
  }
};

export const useFetchSeason = (seasonName: string) => {
  return useQuery(['season', seasonName], () => fetchSeasonRQ(seasonName));
};

// ------------------------------
// 2. TEAM-RELATED FETCHES
// ------------------------------

/**
 * Fetches a team by ID from Firestore.
 *
 * Takes a team ID string.
 * Gets the team document reference by ID.
 * Fetches the team document snapshot.
 * If found, returns a Team object from the snapshot data.
 * If not found, throws an error.
 */

export const fetchTeamByIdRQ = async (
  teamId: string | undefined,
): Promise<Team | null> => {
  if (teamId === undefined) {
    throw new Error('Team ID not provided');
  }
  const teamDoc = doc(db, 'teams', teamId);
  const teamDocSnapshot = await getDoc(teamDoc);
  if (teamDocSnapshot.exists()) {
    const teamData = teamDocSnapshot.data() as Team;
    teamData.id = teamDocSnapshot.id;
    return teamData;
  } else {
    throw new Error('Team not found');
  }
};

export const useFetchTeamById = (teamId: string | undefined) => {
  return useQuery(['team', teamId], () => fetchTeamByIdRQ(teamId), {
    enabled: teamId !== undefined,
  });
};

/**
 * Fetches all teams for a given season from Firestore.
 *
 * Takes a season name/id string.
 * Gets the season document.
 * Maps over the season's team IDs to fetch each team document.
 * Awaits all team fetch promises.
 * Filters out any null teams.
 * Returns the array of Team objects.
 */

const fetchTeamsFromSeasonRQ = async (
  seasonName: SeasonName | undefined,
): Promise<Team[]> => {
  const seasonDoc = await fetchSeasonRQ(seasonName);
  if (!seasonDoc.teams || seasonDoc.teams.length === 0) {
    return [];
  }
  const teamsPromises = seasonDoc.teams.map(async teamId =>
    fetchTeamByIdRQ(teamId),
  );
  const teams = await Promise.all(teamsPromises);
  return teams.filter(team => team !== null) as Team[];
};

export const useFetchTeamsFromSeason = (seasonName: SeasonName | undefined) => {
  return useQuery(
    ['teamsFromSeason', seasonName],
    () => fetchTeamsFromSeasonRQ(seasonName),
    {
      enabled: !!seasonName,
    },
  );
};

// ------------------------------
// 2. PLAYER-RELATED FETCHES
// ------------------------------

/**
 * Fetches a PastPlayer object by ID from Firestore.
 *
 * @param playerId - The ID of the past player to fetch.
 * @returns A Promise resolving to the PastPlayer object if found, or null if not found.
 * @throws Error if ID is not provided.
 */
export const fetchPastPlayerByIdRQ = async (
  playerId: Email | undefined,
): Promise<PastPlayer | null> => {
  if (playerId === undefined) {
    throw new Error('Player ID not provided');
  }
  const playerDoc = doc(db, 'pastPlayers', playerId);
  const playerDocSnapshot = await getDoc(playerDoc);
  if (playerDocSnapshot.exists()) {
    return {
      id: playerDocSnapshot.id,
      ...(playerDocSnapshot.data() as Omit<PastPlayer, 'id'>),
    };
  } else {
    throw new Error('Player not found');
  }
};

export const useFetchPastPlayerById = (playerId: Email | undefined) => {
  return useQuery(
    ['pastPlayer', playerId],
    () => fetchPastPlayerByIdRQ(playerId),
    {
      enabled: !!playerId,
    },
  );
};

/**
 * Fetches a CurrentUser object by ID from Firestore.
 *
 * @param id - The ID of the user to fetch.
 * @returns A Promise resolving to the CurrentUser object if found, or null if not found.
 * @throws Error if ID is not provided.
 */
export const fetchCurrentUserById = async (
  id: string | undefined,
): Promise<CurrentUser | null> => {
  if (id === undefined) {
    throw new Error('User ID not provided');
  }
  const userDoc = doc(db, 'currentUsers', id as string);
  const userDocSnapshot = await getDoc(userDoc);

  if (userDocSnapshot.exists()) {
    return {
      id: userDocSnapshot.id,
      ...(userDocSnapshot.data() as Omit<CurrentUser, 'id'>),
    };
  } else {
    throw new Error('User not found');
  }
};

export const useFetchCurrentUserById = (id: string | undefined) => {
  return useQuery(['currentUser', id], () => fetchCurrentUserById(id), {
    enabled: !!id,
  });
};
