// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useUpdateSeasonSchedule
// 2. FireBaseFunctions
//    - updateSeasonScheduleRQ

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
/**
 * Updates the schedule for the given season in Firestore.
 *
 * @param seasonName - The name of the season document to update.
 * @param schedule - The updated schedule object to save.
 */

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
