import { shuffleArray } from '../../globalFunctions';
import { generateRoundRobinSchedule } from './newRoundRobinGenerator';

type RRSchedule = { [week: string]: [number, number][] };

export function generateRandomRoundRobinSchedule(
  numberOfTeams: number = 14,
): RRSchedule {
  //let byeTeam: boolean = false;
  if (numberOfTeams % 2 !== 0) {
    numberOfTeams += 1;
    //byeTeam = true;
  }

  const schedule: RRSchedule = {};
  const teams = Array.from({ length: numberOfTeams }, (_, i) => i + 1);

  for (let week = 0; week < numberOfTeams - 1; ++week) {
    schedule[`Week ${week + 1}`] = [];
    for (let i = 0; i < numberOfTeams / 2; ++i) {
      const match: [number, number] = [teams[i], teams[numberOfTeams - i - 1]];
      schedule[`Week ${week + 1}`].push(match);
    }

    // Rotate teams except the first one
    const firstTeam = teams.shift();
    const shiftedTeam = teams.shift();
    if (firstTeam !== undefined && shiftedTeam !== undefined) {
      teams.push(shiftedTeam);
      teams.unshift(firstTeam);
    }
  }
  const randomSchedule = randomizeMatches(schedule);
  // Return the schedule after the loop is completed

  return randomSchedule;
}

function randomizeMatches(schedule: RRSchedule): RRSchedule {
  const randomizedSchedule = { ...schedule };
  for (const week in schedule) {
    const matches = schedule[week];
    randomizedSchedule[week] = shuffleArray(matches);
  }
  return randomizedSchedule;
}

export function generateMultipleSchedules(
  numberOfSchedules: number = 10000,
  numberOfTeams: number = 14,
): RRSchedule[] {
  const schedules: RRSchedule[] = [];
  for (let i = 0; i < numberOfSchedules; i++) {
    const newSchedule = generateRoundRobinSchedule(numberOfTeams);
    schedules.push(newSchedule);
  }
  return schedules;
}

type TeamPlayCounts = { [team: number]: number[] };

export function countTeamPlaysByTable(rawSchedule: RRSchedule): TeamPlayCounts {
  const teamPlayCounts: TeamPlayCounts = {};

  // Initialize counts for each team and table
  for (const week in rawSchedule) {
    rawSchedule[week].forEach((match, tableIndex) => {
      match.forEach(team => {
        if (!teamPlayCounts[team]) {
          teamPlayCounts[team] = Array(7).fill(0);
        }
      });
    });
  }

  // Count plays for each team at each table
  for (const week in rawSchedule) {
    rawSchedule[week].forEach((match, tableIndex) => {
      match.forEach(team => {
        teamPlayCounts[team][tableIndex]++;
      });
    });
  }

  return teamPlayCounts;
}

function gradeSingleSchedule(schedule: RRSchedule): number | 'fail' {
  // get the table count
  const tableCount: TeamPlayCounts = countTeamPlaysByTable(schedule);
  let threeCount = 0;
  // iterate thru tableCount
  for (const teamNumber in tableCount) {
    // get each array
    const teamCountArray = tableCount[Number(teamNumber)];

    for (const count of teamCountArray) {
      // find unacceptable counts
      if (count === 0 || count >= 4) {
        return 'fail'; // Fail the schedule if any team plays 0 or >=4 times on a table
      }
      //find and count 3s for grading system
      if (count === 3) {
        threeCount++;
      }
    }
  }

  return threeCount;
}

export function getTheBestSchedules(schedules: RRSchedule[]): RRSchedule[] {
  const bestSchedules: RRSchedule[] = [];
  let bestGrade = Infinity;
  // iterate thru schedules
  schedules.forEach(schedule => {
    //grade each schedule
    const grade = gradeSingleSchedule(schedule);
    // grade is the number of 3s in the count less is 3s are desirable
    if (grade !== 'fail') {
      // if the schedule passes find if it is better than our best so far
      if (grade < bestGrade) {
        // make this schedule new 'best' and set it as best grade
        bestGrade = grade;
        bestSchedules.length = 0; // Clear array
        bestSchedules.push(schedule); // add the schedule to the best array
      } else if (grade === bestGrade) {
        //if this schedule matches the best grade add it to the best array
        bestSchedules.push(schedule);
      }
    }
  });

  return bestSchedules;
}

// function gradeSchedules(schedules: RRSchedule[]): RRSchedule[] {
//   const bestSchedules: RRSchedule[] = [];
//   let threeCount = Infinity;
//   // iterate thru schedule arrays
//   schedules.forEach(schedule => {
//     // create a teamCount object for each schedule
//     const tableCount: TeamPlayCounts = countTeamPlaysByTable(schedule);
//     // iterate thru tableCount
//     Object.keys(tableCount).forEach(key => {
//       const teamNumber = Number(key);
//       // iterate thru each teamCount
//       const teamCountArray = tableCount[teamNumber];
//       // search for 0s if found fail (fail moves on to next schedule)
//       // search for >=4 if found fail
//       //count the threes
//     });
//   });

//   return bestSchedules;
// }
