// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useAddOrUpdateSeason
// 2. FireBaseFunctions
//    - addOrUpdateSeasonRQ

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
import { Season, SeasonName } from '../assets/types';
import { toast } from 'react-toastify';
import { createSuccess, failedCreate } from './firebaseConsts';

// ------------------------------
// 1. HOOKS
// ------------------------------

export const useAddOrUpdateSeason = ({
  useToast = false,
  successMessage = createSuccess,
  failedMessage = failedCreate,
}: {
  useToast?: boolean;
  successMessage?: string;
  failedMessage?: string;
} = {}) => {
  return useMutation(addOrUpdateSeasonRQ, {
    onSuccess: () => {
      if (useToast) toast.success(successMessage);
    },
    onError: error => {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred.';
      toast.error(failedMessage + errorMessage);
    },
  });
};

// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------

const addOrUpdateSeasonRQ = async ({
  seasonName,
  seasonData,
}: {
  seasonName: SeasonName;
  seasonData: Season;
}) => {
  const seasonRef = doc(db, 'Seasons', seasonName);
  await setDoc(
    seasonRef,
    { ...seasonData, seasonCompleted: false },
    { merge: true },
  );
};
