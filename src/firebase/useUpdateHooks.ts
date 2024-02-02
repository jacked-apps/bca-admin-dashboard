// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Season - related
//    - useFetchSeasons
// 2. Team-related updates
//    - useChangeTeamName
//    - updateTeamData
// 3. Schedule-related updates
//    - updateSeasonSchedule

//------------------------
// IMPORTS
//------------------------
import { useQuery, useMutation } from 'react-query';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  getDoc,
} from '@firebase/firestore';
import { toast } from 'react-toastify';
//------------------------
// TYPES
//------------------------
import {
  Season,
  SeasonName,
  Team,
  TeamId,
  TeamName,
  TeamPlayerRole,
} from '../assets/types';
import { fetchPastPlayerByIdRQ } from '.';

type UpdateDataOptions = {
  toast?: boolean;
  successMessage?: string;
  errorMessage?: string;
};

// ------------------------------
// 1. SEASON-RELATED UPDATES
// ------------------------------

// ------------------------------
// 2. TEAM-RELATED UPDATES
// ------------------------------

/**
 * Updates a team's name in Firestore.
 *
 * @param teamId - The ID of the team to update
 * @param newTeamName - The new name for the team
 */

const changeTeamNameRQ = async ({
  teamId,
  newTeamName,
}: {
  teamId: TeamId;
  newTeamName: TeamName;
}): Promise<void> => {
  const teamDoc = doc(db, 'teams', teamId);
  const teamDocSnap = await getDoc(teamDoc);
  if (teamDocSnap.exists()) {
    const newTeamData = {
      ...teamDocSnap.data(),
      teamName: newTeamName,
    };
    await updateDoc(teamDoc, newTeamData);
  }
};

export const useChangeTeamName = ({
  options,
}: {
  options: UpdateDataOptions;
}) => {
  return useMutation(changeTeamNameRQ, {
    onSuccess: () => {
      if (options.toast) {
        toast.success(options.successMessage || 'Team name changed');
      }
    },
    onError: (error: unknown) => {
      if (options.toast) {
        const message =
          error instanceof Error ? error.message : 'An unknown error occurred.';
        toast.error(options.errorMessage || message);
      } else {
        console.error(error);
      }
    },
  });
};

const removePlayerFromTeam = async (teamId: TeamId, role: TeamPlayerRole) => {
  const teamRef = doc(db, 'teams', teamId);
  const teamDoc = await getDoc(teamRef);
  if (teamDoc.exists()) {
    const teamData = teamDoc.data();
    const player = teamData.players[role];
    if (player.firstName === '' && player.lastName === '') {
      return;
    }
    const pastPlayerId = player.pastPlayerId;
    const currentUserId = player.currentUserId;
    const pastPlayer = await fetchPastPlayerByIdRQ(pastPlayerId);
    // get pastPlayer document
    // remove teamId from teams array
    // TODO write updatePastPlayer
    // get currentUser document
    // TODO write fetch currentUserById
    // remove teamId from teams array
    // TODO write update currentUser
    // update team document with new player
    if (player) {
      const newPlayerArray = player.filter(
        player => player.playerId !== playerInfo.playerId,
      );
      const newTeamData = {
        ...teamData,
        players: {
          ...teamData.players,
          [role]: newPlayerArray,
        },
      };
      await updateDoc(teamRef, newTeamData);
    }
  }
};

// ------------------------------
// 2. PLAYER-RELATED UPDATES
// ------------------------------

export const updatePlayerRQ;
