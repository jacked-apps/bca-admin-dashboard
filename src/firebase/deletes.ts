// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. User-related
//    - deletePastPlayer
// 2. Team-related
//    - removeTeamFromSeason

// ------------------------------
// IMPORTS and VARIABLES
// ------------------------------
import { doc, deleteDoc, updateDoc, arrayRemove } from '@firebase/firestore'; // Import getFirestore from Firebase
import { db } from '../firebaseConfig';
import { Email, SeasonName, TeamId } from '../assets/types';
// ------------------------------
// 1. USER-RELATED
// ------------------------------

export const deletePastPlayer = async (playerId: Email) => {
  try {
    const playerRef = doc(db, 'pastPlayers', playerId);
    await deleteDoc(playerRef);
  } catch (error) {
    console.log('Error deleting pastPlayer', error);
  }
};
// ------------------------------
// 2. TEAM-RELATED UPDATES
// ------------------------------

/**
 * Removes a team from the teams table and removes the team id from the seasons teams array
 * @param {SeasonName} seasonName - The unique name of a season used as the document ID
 * @param {TeamId} teamId - The unique ID of a team to remove to the seasonName
 * @returns {Promise<void>} - A promise indicating the completion of adding a team
 */

export const removeTeamFromSeason = async (
  seasonName: SeasonName,
  teamId: TeamId,
) => {
  try {
    //reference to the season document
    const seasonRef = doc(db, 'seasons', seasonName);

    // remove the teamId from the teams array
    await updateDoc(seasonRef, {
      teams: arrayRemove(teamId),
    });

    //reference to the team document
    const teamRef = doc(db, 'teams', teamId);

    // remove the team document from the teams collection
    await deleteDoc(teamRef);
    console.log('Successfully removed team from season and deleted team');
  } catch (error) {
    console.error(`Error removing team from ${seasonName}`, error);
  }
};
