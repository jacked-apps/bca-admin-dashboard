// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season - related
//    - useFetchSeasons
// 2. Team-related updates
//    - useFetchTeams
//    - updateTeamData
// 3. Schedule-related updates
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
import { Season, SeasonName, Team } from '../assets/types';

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

const fetchSeasonRQ = async (seasonName: string): Promise<Season> => {
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

const fetchTeamByIdRQ = async (teamId: string): Promise<Team | null> => {
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

export const useFetchTeamById = (teamId: string) => {
  return useQuery(['team', teamId], () => fetchTeamByIdRQ(teamId));
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
  seasonName: SeasonName,
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

export const useFetchTeamsFromSeason = (seasonName: SeasonName) => {
  return useQuery(
    ['teamsFromSeason', seasonName],
    () => fetchTeamsFromSeasonRQ(seasonName),
    {
      enabled: !!seasonName,
    },
  );
};
