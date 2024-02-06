// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useAddTeamToSeason
//    - useRemoveTeamFromSeason
//    - useUpdateTeamData
// 2. FireBaseFunctions
//    - addTeamToSeasonRQ
//    - removeTeamFromSeasonRQ
//    - updateTeamDataRQ

//------------------------
// IMPORTS
//------------------------
import { useMutation } from 'react-query';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  updateDoc,
  addDoc,
  doc,
  setDoc,
} from '@firebase/firestore';
import { Season, SeasonName, Team, TeamId, TeamName } from '../assets/types';
import { updateSeasonRQ, fetchSeasonRQ } from '.';
import { HookProps, mutationConfig } from './utilities';

// ------------------------------
// 1. HOOKS
// ------------------------------

export const useAddTeamToSeason = (props: HookProps = {}) => {
  return useMutation(addTeamToSeasonRQ, mutationConfig(props));
};

export const useRemoveTeamFromSeason = (props: HookProps = {}) => {
  return useMutation(removeTeamFromSeasonRQ, mutationConfig(props));
};

export const useUpdateTeamData = (props: HookProps = {}) => {
  return useMutation(updateTeamDataRQ, mutationConfig(props));
};
// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------

/**
 * Adds a team to a season.
 *
 * @param seasonName - The name of the season to add the team to.
 * @param teamId - The ID of the team to add.
 *
 * Fetches the season, adds the team ID to the teams array,
 * and updates the season with the new teams array.
 */

const addTeamToSeasonRQ = async ({
  seasonName,
  teamId,
}: {
  seasonName: SeasonName;
  teamName: TeamName;
  teamId: TeamId;
}) => {
  const season = await fetchSeasonRQ(seasonName);
  if (!season) return;

  const teamArray = season.teams;
  const newArray = [...teamArray, teamId];
  await updateSeasonRQ({ seasonName, seasonData: { teams: newArray } });
};

/**
 * Removes a team from a season.
 *
 * @param seasonName - The name of the season to remove the team from.
 * @param teamId - The ID of the team to remove.
 *
 * Fetches the season, filters the team array to remove the given team ID,
 * and updates the season with the new team array.
 */

const removeTeamFromSeasonRQ = async ({
  seasonName,
  teamId,
}: {
  seasonName: SeasonName;
  teamId: TeamId;
}) => {
  const season = await fetchSeasonRQ(seasonName);
  if (!season) return;

  const teamArray = season.teams;
  const newArray = teamArray.filter(team => team !== teamId);
  await updateSeasonRQ({ seasonName, seasonData: { teams: newArray } });
};

/**
 * Updates the data for the team with the given ID.
 *
 * @param teamId - The ID of the team to update.
 * @param data - The new team data to update.
 */
const updateTeamDataRQ = async ({
  teamId,
  data,
}: {
  teamId: TeamId;
  data: Team;
}) => {
  // Reference to the team document
  const teamRef = doc(db, 'teams', teamId);
  // Update team data
  await updateDoc(teamRef, data);
};
