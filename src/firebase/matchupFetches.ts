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
import { Season } from '../assets/typesFolder/seasonTypes';
import { SeasonName } from '../assets/typesFolder/sharedTypes';

// ------------------------------
// 1. HOOKS
// ------------------------------

// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------
