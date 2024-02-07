type TableTuple = [number, number];
type WeekMatches = TableTuple[];

export function generateAnotherSchedule(
  teams: number[],
  weeks: number,
): Record<string, WeekMatches> {
  let byeTeamNumber = 0;
  // Adjust for odd number of teams
  if (teams.length % 2 !== 0) {
    teams.push(teams.length + 1);
    // Adding a bye team
    byeTeamNumber = teams.length;
  }

  const schedule: Record<string, WeekMatches> = {};
  const fullRotation = teams.length;
  let currentRotation = 0;
  for (let week = 1; week <= weeks; week++) {
    const matchups: WeekMatches = [];
    currentRotation++;
    // Generate round-robin matchups
    // Simplified approach: rotate teams and pair them
    const rotatedTeams = rotateTeams(teams, currentRotation - 1);
    //console.log(rotatedTeams, currentRotation, fullRotation);
    if (currentRotation === fullRotation) {
      currentRotation = 0;
    }
    for (let i = 0; i < rotatedTeams.length / 2; i++) {
      matchups.push([
        rotatedTeams[i],
        rotatedTeams[rotatedTeams.length - 1 - i],
      ]);
    }

    schedule[`Week ${week}`] = matchups;
  }
  if (byeTeamNumber !== 0) {
    //.log('this is the bye team', byeTeamNumber);
  } else {
    //console.log('No byes');
  }
  return schedule;
}

function rotateTeams(teams: number[], rotationCount: number): number[] {
  // Rotates the array of teams by rotationCount
  const rotatedArray = teams
    .slice(rotationCount)
    .concat(teams.slice(0, rotationCount));
  return rotatedArray;
}

// // Example usage
// const teams = [1, 2, 3, 4]; // Example teams
// const weeks = 16; // Number of weeks
// const schedule = generateSchedule(teams, weeks);
// console.log(schedule);
