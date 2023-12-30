/**
 * Creates an object with a round robin tournament schedule.  the object will contain a week number key
 * followed by an array of tuples. each tuple representing a table with each team playing on that table.
 * @param {number} numberOfTeams - The number of teams
 * @param {string} lengthOfSeason - The length of the season
 * @returns {RoundRobinSchedule} - A round robin tournament schedule for the amount of teams given and the given length of the season
 */

import { RoundRobinSchedule } from '../assets/types';

const generateRoundRobinSchedule = (
  inputNumberOfTeams: number,
  lengthOfSeason: number = 16,
): RoundRobinSchedule => {
  let numberOfTeams = inputNumberOfTeams;
  if (numberOfTeams <= 4) {
    numberOfTeams = 4;
  }
  if (numberOfTeams % 2 !== 0) {
    numberOfTeams++; // Add a bye if the number of teams is odd
  }

  const weeks = lengthOfSeason;
  const halfSize = numberOfTeams / 2;
  const teams = Array.from({ length: numberOfTeams }, (_, i) => i + 1);
  let awayTeams = [7, 8, 9, 10, 11, 12, 13];

  const schedule: RoundRobinSchedule = {};

  for (let week = 1; week <= weeks; week++) {
    schedule[`Week ${week}`] = [];

    for (let i = 0; i < halfSize; i++) {
      let home = teams[i];
      let away = teams[numberOfTeams - 1 - i];

      // Avoid matching a team with itself (in case of odd number of teams and a bye)
      if (home !== away) {
        // if team 1 is home and one of the above is away
        if (home === 1 && awayTeams.includes(away)) {
          // take out away team from array
          awayTeams = awayTeams.filter(team => team !== away);
          // make team 1 away
          [home, away] = [away, home];
        }
      }

      schedule[`Week ${week}`].push([home, away]);
    }

    // Rotate teams for the next round
    teams.splice(1, 0, teams.pop()!);
  }
  const homeAwayBalanced = balanceHomeAway(schedule);
  return homeAwayBalanced;
};

const countHomeAwayPositions = (schedule: RoundRobinSchedule) => {
  const homeAwayCount: { [team: string]: { home: number; away: number } } = {};

  for (const weekMatches of Object.values(schedule)) {
    weekMatches.forEach(([homeTeam, awayTeam]) => {
      // Initialize the count if not already done
      if (!homeAwayCount[homeTeam])
        homeAwayCount[homeTeam] = { home: 0, away: 0 };
      if (!homeAwayCount[awayTeam])
        homeAwayCount[awayTeam] = { home: 0, away: 0 };

      // Increment home and away counts
      homeAwayCount[homeTeam].home++;
      homeAwayCount[awayTeam].away++;
    });
  }
  const homeOver: number[] = [];
  const awayOver: number[] = [];
  const halfWeeks = (homeAwayCount['1'].home + homeAwayCount['1'].away) / 2;
  Object.keys(homeAwayCount).forEach(key => {
    if (homeAwayCount[key].home >= halfWeeks + 1) {
      homeOver.push(parseInt(key, 10));
    }
    if (homeAwayCount[key].away >= halfWeeks + 1) {
      awayOver.push(parseInt(key, 10));
    }
  });
  return { homeOver, awayOver, homeAwayCount };
};

const balanceHomeAway = (schedule: RoundRobinSchedule): RoundRobinSchedule => {
  const { homeOver, awayOver } = countHomeAwayPositions(schedule);
  let homeArray = [...homeOver];
  let awayArray = [...awayOver];
  Object.keys(schedule).map(week => {
    // grab the week array
    schedule[week].forEach((tuple, index) => {
      if (homeArray.includes(tuple[0]) && awayArray.includes(tuple[1])) {
        schedule[week][index] = [tuple[1], tuple[0]];
        homeArray = homeArray.filter(item => item !== tuple[0]);
        awayArray = awayArray.filter(item => item !== tuple[1]);
      }
    });
  });

  return schedule;
};

type TeamPlayCounts = { [team: number]: number[] };

function countTeamPlaysByTable(
  rawSchedule: RoundRobinSchedule,
): TeamPlayCounts {
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

const balanceTeamsByTable = (schedule: RoundRobinSchedule) => {
  const balanceTeamOneSchedule = { ...schedule };
  const numberOfTables = schedule['Week 1'].length;
  let tableNumber = 0;
  Object.keys(balanceTeamOneSchedule).forEach(week => {
    const tableArray = balanceTeamOneSchedule[week];
    const tableOne = tableArray.shift();
    tableOne && tableArray.splice(tableNumber, 0, tableOne);
    balanceTeamOneSchedule[week] = tableArray;
    tableNumber++;
    if (tableNumber >= numberOfTables) {
      tableNumber = 0;
    }
  });
  return balanceTeamOneSchedule;
};

const getAverageHighAndLow = (schedule: RoundRobinSchedule) => {
  const numberOfTables = schedule['Week 1'].length;
  const seasonLength = Object.keys(schedule).length;
  const averageLow = Math.floor(seasonLength / numberOfTables);
  const averageHigh = Math.ceil(seasonLength / numberOfTables);
  return { averageHigh, averageLow };
};

const calculatePercentageOfAverageNumbers = (
  schedule: RoundRobinSchedule,
): number => {
  const tableCount = countTeamPlaysByTable(schedule);
  const { averageLow, averageHigh } = getAverageHighAndLow(schedule);

  let countAverage = 0;
  let totalEntries = 0;

  Object.values(tableCount).forEach(teamArray => {
    teamArray.forEach(count => {
      if (count === averageLow || count === averageHigh) {
        countAverage++;
      }
    });
    totalEntries += teamArray.length;
  });
  return (countAverage / totalEntries) * 100;
};

type TeamAndTableCounts = {
  team: string;
  table: number;
};

const findMinAndMaxTablePlays = (schedule: RoundRobinSchedule) => {
  const tableCount = countTeamPlaysByTable(schedule);
  let maxCount = 0;
  let minCount = Infinity;
  let maxTeamsAndTables: TeamAndTableCounts[] = [];
  let minTeamsAndTables: TeamAndTableCounts[] = [];

  Object.entries(tableCount).forEach(([team, counts]) => {
    counts.forEach((count, tableIndex) => {
      const object = { team, table: tableIndex + 1 };
      if (count > maxCount) {
        maxCount = count;
        maxTeamsAndTables = [object];
      } else if (count === maxCount) {
        maxTeamsAndTables.push(object);
      }

      if (count < minCount) {
        minCount = count;
        minTeamsAndTables = [object];
      } else if (count === minCount) {
        minTeamsAndTables.push(object);
      }
    });
  });
  return { maxTeamsAndTables, minTeamsAndTables };
};
type PotentialSwap = {
  week: string;
  tableIndex: number;
  opposingTeam: number | undefined;
};

const potentialHighSwaps = (
  schedule: RoundRobinSchedule,
  teamAndTable: TeamAndTableCounts,
) => {
  const potentialSwaps: PotentialSwap[] = [];
  const { averageLow, averageHigh } = getAverageHighAndLow(schedule);
  const targetTeam = parseInt(teamAndTable.team, 10);
  const tableCount = countTeamPlaysByTable(schedule);
  for (const [week, matchups] of Object.entries(schedule)) {
    matchups.forEach((matchup, index) => {
      if (matchup.includes(targetTeam) && index === teamAndTable.table - 1) {
        const opposingTeam = matchup.find(team => team !== targetTeam);
        if (opposingTeam && tableCount[opposingTeam][index] >= averageHigh) {
          potentialSwaps.push({ week, tableIndex: index, opposingTeam });
        }
      }
    });
  }
};

const balanceTableCounts = (schedule: RoundRobinSchedule) => {
  //const tableCount = countTeamPlaysByTable(schedule);

  const { averageLow, averageHigh } = getAverageHighAndLow(schedule);
  const { maxTeamsAndTables, minTeamsAndTables } =
    findMinAndMaxTablePlays(schedule);
  const percentage = calculatePercentageOfAverageNumbers(schedule);
  potentialHighSwaps(schedule, maxTeamsAndTables[0]);

  return percentage;
};

const findBestSwapTable = (
  targetTeam: number,
  opposingTeam: number,
  schedule: RoundRobinSchedule,
  averageLow: number,
): number | null => {
  let bestTableIndex = null;
  let lowestCombinedCount = Infinity;
  const tableCount = countTeamPlaysByTable(schedule);

  for (let i = 0; i < tableCount[targetTeam].length; i++) {
    const targetTeamCount = tableCount[targetTeam][i];
    const opposingTeamCount = tableCount[opposingTeam][i];

    if (targetTeamCount <= averageLow && opposingTeamCount <= averageLow) {
      return i; // Found a table suitable for both
    }

    // If not found, keep track of the table with the lowest combined count
    const combinedCount = targetTeamCount + opposingTeamCount;
    if (combinedCount < lowestCombinedCount) {
      lowestCombinedCount = combinedCount;
      bestTableIndex = i;
    }
  }

  return bestTableIndex;
};

// Example usage
