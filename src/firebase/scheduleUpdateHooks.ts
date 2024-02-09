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
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from '@firebase/firestore';
import { Schedule } from '../assets/typesFolder/seasonTypes';
import { SeasonName } from '../assets/typesFolder/sharedTypes';
import { HookProps, mutationConfig } from './utilities';

// ------------------------------
// 1. HOOKS
// ------------------------------

export const useUpdateSeasonSchedule = (props: HookProps = {}) => {
  return useMutation(updateSeasonScheduleRQ, mutationConfig(props));
};

// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------

export const updateSeasonScheduleRQ = async ({
  seasonName,
  schedule,
}: {
  seasonName: SeasonName;
  schedule: Schedule;
}) => {
  //reference to the season document
  const seasonRef = doc(db, 'seasons', seasonName);
  await updateDoc(seasonRef, {
    schedule: schedule,
  });
};
