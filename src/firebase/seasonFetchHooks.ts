// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useFetchSeasons
//    - useFetchSeason
// 2. FireBaseFunctions
//    - fetchSeasonsRQ
//    - fetchSeasonRQ

//------------------------
// IMPORTS
//------------------------
import { useQuery, useQueryClient } from 'react-query';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from '@firebase/firestore';
import { Season, SeasonName } from '../assets/types';

// ------------------------------
// 1. HOOKS
// ------------------------------

export const useFetchSeasons = () => {
  const queryClient = useQueryClient();

  const refetchSeasons = () => {
    queryClient.invalidateQueries('seasons');
  };
  return { ...useQuery('currentSeasons', fetchSeasonsRQ), refetchSeasons };
};

export const useFetchSeason = (seasonName: string) => {
  return useQuery(['season', seasonName], () => fetchSeasonRQ(seasonName));
};

// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------

/**
 * Fetches ALL seasons from Firestore where seasonCompleted = false.
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

/**
 * Fetches a SINGLE season by name/id from Firestore.
 *
 * Takes a season name/id string.
 * Gets the season document reference by name.
 * Fetches the season document snapshot.
 * If found, returns a Season object from the snapshot data.
 * If not found, throws an error.
 */

export const fetchSeasonRQ = async (
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
