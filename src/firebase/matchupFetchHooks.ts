// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Hooks
//    - useFetchRoundRobin
//    - useFetchFinishedRoundRobin
// 2. FireBaseFunctions
//    - fetchRoundRobinRQ
//    - fetchFinishedRoundRobinRQ

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
import { SeasonName } from '../assets/typesFolder/sharedTypes';
import {
  RoundRobinSchedule,
  RoundRobinScheduleFinished,
} from '../assets/typesFolder/matchupTypes';
import { notFound } from './firebaseConsts';

// ------------------------------
// 1. HOOKS
// ------------------------------

export const useFetchRoundRobin = (numberOfTeams: number | undefined) => {
  return useQuery(
    ['roundRobin', numberOfTeams],
    () => fetchRoundRobinRQ(numberOfTeams),
    { enabled: !!numberOfTeams },
  );
};

export const useFetchFinishedRoundRobin = (
  seasonName: SeasonName | undefined,
) => {
  return useQuery(
    ['roundRobinFinished', seasonName],
    () => fetchFinishedRoundRobinRQ(seasonName),
    { enabled: !!seasonName },
  );
};

// ------------------------------
// 2. FIREBASE FUNCTIONS
// ------------------------------

/**
 * Adjusts the number of teams to be valid for generating a round robin schedule.
 *
 * - Ensures number of teams is even by adding 1 if odd.
 * - Sets number to minimum of 4 teams.
 * - Throws error if more than 48 teams.
 *
 * @param numberOfTeams - Original number of teams
 * @returns Adjusted number of teams valid for round robin schedule.
 */
const adjustNumberOfTeams = (numberOfTeams: number) => {
  let adjustedNumber = numberOfTeams;
  if (numberOfTeams % 2 !== 0) {
    adjustedNumber += 1;
  }
  if (numberOfTeams < 4) {
    adjustedNumber = 4;
  }
  if (numberOfTeams > 48) {
    throw new Error(
      'Round Robin Schedule for more than 48 teams not supported',
    );
  }
  return adjustedNumber;
};

/**
 * Fetches a round robin schedule from Firestore for the given number of teams.
 *
 * Adjusts the number of teams to be valid for round robin generation.
 * Looks up the schedule by the adjusted team name in Firestore.
 * Returns the schedule if found, else throws an error.
 */
const fetchRoundRobinRQ = async (
  numberOfTeams: number | undefined,
): Promise<RoundRobinSchedule | null> => {
  if (numberOfTeams === undefined) {
    throw new Error('Number of teams not provided');
  }
  const adjustedTeams = adjustNumberOfTeams(numberOfTeams);
  const scheduleName = `scheduleFor${adjustedTeams}Teams`;
  const scheduleRef = doc(db, 'roundRobinSchedules', scheduleName);
  const scheduleDoc = await getDoc(scheduleRef);
  if (scheduleDoc.exists()) {
    return scheduleDoc.data() as RoundRobinSchedule;
  } else {
    throw new Error(
      `Round Robin Schedule for ${adjustedTeams} teams ${notFound}`,
    );
  }
};

/**
 * Fetches a finished round robin schedule from Firestore for the given season ID.
 *
 * Looks up the schedule by season ID in the 'finishedRoundRobinSchedules' collection.
 * Returns the schedule if found, else throws an error.
 */
const fetchFinishedRoundRobinRQ = async (
  seasonId: SeasonName | undefined,
): Promise<RoundRobinScheduleFinished | null> => {
  if (seasonId === undefined) {
    throw new Error('Season ID not provided');
  }
  const scheduleRef = doc(db, 'finishedRoundRobinSchedules', seasonId);
  const scheduleDoc = await getDoc(scheduleRef);
  if (scheduleDoc.exists()) {
    return scheduleDoc.data() as RoundRobinScheduleFinished;
  } else {
    throw new Error(
      `Finished Round Robin Schedule for ${seasonId} ${notFound}`,
    );
  }
};
