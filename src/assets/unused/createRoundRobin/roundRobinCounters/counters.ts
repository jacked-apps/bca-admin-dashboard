type TableTuple = [number, number];
type WeekMatches = TableTuple[];
type Schedule = Record<string, WeekMatches>;

export function countTimesTeamsPlayTeams(
  schedule: Schedule,
  teamCount: number,
): number[][] {
  // Initialize a matrix to store the count of matchups
  const matchupCounts = Array.from({ length: teamCount }, () =>
    Array(teamCount).fill(0),
  );

  Object.values(schedule).forEach(week => {
    week.forEach(([team1, team2]) => {
      if (team1 !== team2) {
        // Exclude self-matchups, adjust if needed
        matchupCounts[team1 - 1][team2 - 1]++;
        matchupCounts[team2 - 1][team1 - 1]++;
      }
    });
  });

  return matchupCounts;
}

// Example usage
// const schedule = { ... }; // Your schedule goes here
// const teamCount = 14; // Total number of teams
// const matchups = countMatchups(schedule, teamCount);
// console.log(matchups);
