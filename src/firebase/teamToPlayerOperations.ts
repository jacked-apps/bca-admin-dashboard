// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useAddTeamToBothViaPlayer
//    - useAddTeamToBothViaUser
//    - useRemoveTeamFromBothViaPlayer
//    - useRemoveTeamFromBothViaUser
//    - usePlayerToTeam
// 2. Utilities
//    - addTeamToPastPlayer
//    - addTeamToCurrentUser
//    - addTeamToBothWithPlayer
//    - addTeamToBothWithUser
//    - removeTeamFromPastPlayer
//    - removeTeamFromCurrentUser
//    - removeTeamFromBothWithPlayer
//    - removeTeamFromBothWithUser
//    - addPlayerToTeamRQ
//    - insertPlayerOntoTeam

import {
  doc,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from '@firebase/firestore'; // Import getFirestore from Firebase
import { db } from '../firebaseConfig';
import {
  Email,
  PlayerId,
  Team,
  TeamId,
  TeamPlayer,
  TeamPlayerRole,
} from '../assets/types';
import {
  fetchCurrentUserById,
  fetchPastPlayerByIdRQ,
  fetchTeamByIdRQ,
} from '.';
import { useMutation } from 'react-query';

export const useAddTeamToBothViaPlayer = () => {
  return useMutation(addTeamToBothWithPlayer, {
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
    retry: false,
  });
};

export const useAddTeamToBothViaUser = () => {
  return useMutation(addTeamToBothWithUser, {
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
    retry: false,
  });
};

export const useRemoveTeamFromBothViaPlayer = () => {
  return useMutation(removeTeamFromBothWithPlayer, {
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
    retry: false,
  });
};

export const useRemoveTeamFromBothViaUser = () => {
  return useMutation(removeTeamFromBothWithUser, {
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
    retry: false,
  });
};

export const useAddPlayerToTeam = () => {
  return useMutation(addPlayerToTeamRQ, {
    onSuccess: () => {
      console.log('success');
    },
    onError: () => {
      console.log('error');
    },
    retry: false,
  });
};

/**
 * Adds a team ID to the 'teams' array field of a past player document.
 * @param teamId - The ID of the team to add.
 * @param pastPlayerId - The ID (email address) of the past player document to update.
 */
const addTeamToPastPlayer = async (teamId: TeamId, pastPlayerId: Email) => {
  const playerRef = doc(db, 'pastPlayers', pastPlayerId as Email);
  await updateDoc(playerRef, {
    teams: arrayUnion(teamId as TeamId),
  });
};

/**
 * Adds a team ID to the 'teams' array field of a current user document.
 *
 * @param teamId - The ID of the team to add
 * @param currentUserId - The ID of the current user document to update
 */
const addTeamToCurrentUser = async (
  teamId?: TeamId,
  currentUserId?: PlayerId,
) => {
  if (!teamId || !currentUserId)
    throw new Error('Missing teamId or currentUserId');
  const userRef = doc(db, 'currentUsers', currentUserId as PlayerId);
  await updateDoc(userRef, {
    teams: arrayUnion(teamId as TeamId),
  });
};

/**
 * Adds a team ID to the 'teams' array field of both a past player document and current user document,
 * by looking up the current user ID associated with the past player ID.
 *
 * @param teamId - The ID of the team to add
 * @param pastPlayerId - The ID (email address) of the past player document
 */
const addTeamToBothWithPlayer = async (
  teamId?: TeamId,
  pastPlayerId?: Email,
) => {
  if (!teamId || !pastPlayerId)
    throw new Error('Missing teamId or pastPlayerId');
  await addTeamToPastPlayer(teamId, pastPlayerId);
  const pastPlayer = await fetchPastPlayerByIdRQ(pastPlayerId as Email);
  if (pastPlayer && pastPlayer.currentUserId) {
    await addTeamToCurrentUser(teamId, pastPlayer.currentUserId);
  }
};

/**
 * Adds a team ID to the 'teams' array field of both a current user document and associated past player document.
 * Looks up the past player ID associated with the current user ID.
 *
 * @param teamId - The ID of the team to add
 * @param currentUserId - The ID of the current user document
 */
const addTeamToBothWithUser = async (
  teamId?: TeamId,
  currentUserId?: PlayerId,
) => {
  if (!teamId || !currentUserId)
    throw new Error('Missing teamId or currentUserId');
  await addTeamToCurrentUser(teamId, currentUserId);
  const user = await fetchCurrentUserById(currentUserId as PlayerId);
  if (user && user.pastPlayerId) {
    await addTeamToPastPlayer(teamId, user.pastPlayerId);
  }
};

/**
 * Removes a team ID from the 'teams' array field of a past player document.
 *
 * @param teamId - The ID of the team to remove
 * @param pastPlayerId - The ID (email address) of the past player document
 */
const removeTeamFromPastPlayer = async (
  teamId?: TeamId,
  pastPlayerId?: Email,
) => {
  if (!teamId || !pastPlayerId)
    throw new Error('Missing teamId or pastPlayerId');
  const playerRef = doc(db, 'pastPlayers', pastPlayerId as Email);
  await updateDoc(playerRef, {
    teams: arrayRemove(teamId as TeamId),
  });
};
/**
 * Removes a team ID from the 'teams' array field of a current user document.
 *
 * @param teamId - The ID of the team to remove
 * @param currentUserId - The ID of the current user document
 */

const removeTeamFromCurrentUser = async (
  teamId?: TeamId,
  currentUserId?: PlayerId,
) => {
  if (!teamId || !currentUserId)
    throw new Error('Missing teamId or currentUserId');
  const userRef = doc(db, 'currentUsers', currentUserId as PlayerId);
  await updateDoc(userRef, {
    teams: arrayRemove(teamId as TeamId),
  });
};

/**
 * Removes a team from both a past player and their associated current user, if found.
 *
 * @param teamId - The ID of the team to remove
 * @param pastPlayerId - The ID (email address) of the past player
 */
const removeTeamFromBothWithPlayer = async (
  teamId?: TeamId,
  pastPlayerId?: Email,
) => {
  if (!teamId || !pastPlayerId)
    throw new Error('Missing teamId or pastPlayerId');
  await removeTeamFromPastPlayer(teamId, pastPlayerId);
  const pastPlayer = await fetchPastPlayerByIdRQ(pastPlayerId as Email);
  if (pastPlayer && pastPlayer.currentUserId) {
    await removeTeamFromCurrentUser(teamId, pastPlayer.currentUserId);
  }
};

/**
 * Removes a team from both a current user and their associated past player, if found.
 *
 * @param teamId - The ID of the team to remove
 * @param currentUserId - The ID of the current user
 */
const removeTeamFromBothWithUser = async (
  teamId?: TeamId,
  currentUserId?: PlayerId,
) => {
  if (!teamId || !currentUserId)
    throw new Error('Missing teamId or currentUserId');
  await removeTeamFromCurrentUser(teamId, currentUserId);
  const user = await fetchCurrentUserById(currentUserId as PlayerId);
  if (user && user.pastPlayerId) {
    await removeTeamFromPastPlayer(teamId, user.pastPlayerId);
  }
};

/**
 * Adds a player to a team by:
 * 1. Fetching the team data
 * 2. Removing the team from the old player in that role
 * 3. Inserting the new player data into the team
 * 4. Adding the team to the new player
 * 5. Handling errors
 */
const addPlayerToTeamRQ = async ({
  teamId,
  role,
  playerData,
}: {
  teamId: TeamId;
  role: TeamPlayerRole;
  playerData: TeamPlayer;
}) => {
  // Fetch the team data
  const teamData = await fetchTeamByIdRQ(teamId);
  if (!teamData) {
    throw new Error('Team not found');
  }
  // get the player currently in the role on that team
  const oldPlayer = teamData?.players[role];
  // remove the team from the old player documents
  if (oldPlayer.email) {
    await removeTeamFromBothWithPlayer(teamId, oldPlayer.email);
  } else if (oldPlayer.currentUserId) {
    await removeTeamFromBothWithUser(teamId, oldPlayer.currentUserId);
  }
  try {
    // insert playerData into team document
    await insertPlayerOntoTeam(teamId, role, playerData);

    // if successful add the team to the player documents
    await addTeamToBothWithPlayer(teamId, playerData.email);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Unknown error');
    }
  }
};

/**
 * Inserts a player into a specific role on a team by:
 * - Getting the team document reference
 * - Retrieving the current team data
 * - Updating the team data with the new player in the specified role
 * - Writing the updated team data back to the database
 */
const insertPlayerOntoTeam = async (
  teamId: TeamId,
  role: TeamPlayerRole,
  playerData: TeamPlayer,
) => {
  const teamRef = doc(db, 'teams', teamId);
  const teamDoc = await getDoc(teamRef);
  if (teamDoc.exists()) {
    const teamData = teamDoc.data() as Team;
    const newTeamData = {
      ...teamData,
      players: {
        ...teamData.players,
        [role]: playerData,
      },
    };
    await updateDoc(teamRef, newTeamData);
  }
};
