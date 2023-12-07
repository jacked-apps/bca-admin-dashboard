type RRSchedule = { [week: string]: [number, number][] };

export function generateRoundRobinSchedule(
  numberOfTeams: number = 14,
  totalWeeks: number = 13,
): RRSchedule {
  let byeTeam: boolean = false;
  if (numberOfTeams % 2 !== 0) {
    numberOfTeams += 1;
    byeTeam = true;
  }

  const schedule: RRSchedule = {};
  const totalRounds = numberOfTeams - 1;
  const teams = Array.from({ length: numberOfTeams }, (_, i) => i + 1);

  for (let week = 0; week < totalWeeks; ++week) {
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
  //Handle shifting team 1 if no bye team
  let shiftedSchedule = { ...schedule };
  if (!byeTeam) {
    shiftedSchedule = distributeTeamOne(schedule);

    //adjustTablePlayTimes(shiftedSchedule);
    //schedule = shiftedSchedule;
  }
  //console.log('ITS A BYE!', shiftedSchedule);
  // Return the schedule after the loop is completed
  return schedule;
}
/////////////////////////////////
////////////////////////////////
///////////////////////////////

export const distributeTeamOne = (schedule: RRSchedule) => {
  const newSchedule = { ...schedule };
  Object.keys(newSchedule).forEach(key => {
    const swapArray = [...schedule[key]];
    newSchedule[key] = arrayFirstToRandom(swapArray);
  });

  return newSchedule; // Return the modified schedule
};
//////
//////
/////

function arrayFirstToRandom<T>(array: T[]): T[] {
  const firstItem = array.shift();
  const randomSpot = Math.floor(Math.random() * array.length);
  firstItem && array.splice(randomSpot, 0, firstItem);
  return array;
}
////////////////////////////
///////////////////////////
//////////////////////////

function adjustTablePlayTimes(schedule: RRSchedule) {
  const tableCount = countTeamPlaysByTable(schedule);
  const { fours, threes, ones, zeros } = findTableCounts(tableCount);
  const firstTry = findFirstPairWithSameTable(fours);
  let firstTrade: NumberTuple[] | undefined;
  if (!firstTry || firstTry.length === 0) {
    const firstFour = fours[0];
    const tableNumber = firstFour[1];
    const tableMatch = checkForTableInArray(tableNumber, threes);
    if (tableMatch.length > 0) {
      firstTrade = [firstFour, tableMatch[0]];
    }
    console.log('getting first trade:', firstFour, tableMatch, firstTrade);
  }

  if (firstTrade && firstTrade.length > 0) {
    const teamOne = firstTrade[0][0];
    const teamTwo = firstTrade[1][0];
    // search in zeros for both teams
    const teamOneZeros = checkForTeamInArray(teamOne, zeros);
    const teamTwoZeros = checkForTeamInArray(teamTwo, zeros);
    //
    // see if both teams have a zero on the same table.
    // if they do good swap.

    // if not search in ones for team1 and add it to team1 zeros array
    // search thru both arrays to see if they have same table
    // if they do good swap.

    // if not search in ones for team2 and add it to team2 zeros array
    // search thru both arrays to see if they have same table
    // if they do good swap.

    // if none match
    console.log('if first trade ', teamOneZeros, teamTwoZeros);
  }
  console.log('in adjust', tableCount, fours, firstTrade);
}
//////////////////
/////////////////
////////////////
function checkForTeamInArray(
  teamNumber: number,
  array: NumberTuple[],
): NumberTuple[] {
  const matches = array.filter(tuple => tuple[0] === teamNumber);
  return matches;
}
function checkForTableInArray(
  tableNumber: number,
  array: NumberTuple[],
): NumberTuple[] {
  const matches = array.filter(tuple => tuple[1] === tableNumber);
  return matches;
}
/////////////////////
/////////////////////
////////////////////
export const balanceHomeAway = (schedule: RRSchedule): RRSchedule => {
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

export const countHomeAwayPositions = (schedule: RRSchedule) => {
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
/////////////
/////////////
type NumberTuple = [number, number];
type TableCounters = {
  fours: NumberTuple[];
  threes: NumberTuple[];
  ones: NumberTuple[];
  zeros: NumberTuple[];
};

function findTableCounts(tableCount: TeamPlayCounts): TableCounters {
  const fours: NumberTuple[] = [];
  const threes: NumberTuple[] = [];
  const ones: NumberTuple[] = [];
  const zeros: NumberTuple[] = [];

  Object.entries(tableCount).forEach(([key, values]) => {
    values.forEach((value, index) => {
      if (value >= 4) {
        fours.push([parseInt(key), index]);
      }
      if (value === 3) {
        threes.push([parseInt(key), index]);
      }
      if (value === 1) {
        ones.push([parseInt(key), index]);
      }
      if (value === 0) {
        zeros.push([parseInt(key), index]);
      }
    });
  });

  return { fours, threes, ones, zeros };
}

function findFirstPairWithSameTable(
  threes: NumberTuple[],
): NumberTuple[] | null {
  for (let i = 0; i < threes.length; i++) {
    for (let j = i + 1; j < threes.length; j++) {
      if (threes[i][1] === threes[j][1]) {
        // First pair found with the same table number
        return [threes[i], threes[j]];
      }
    }
  }

  return null; // Return null if no pair is found
}
