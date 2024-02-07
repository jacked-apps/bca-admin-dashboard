// Adjust Team 1's table assignments
for (let week = 1; week <= totalWeeks; ++week) {
  const weekMatches = schedule[`Week ${week}`];
  const team1MatchIndex = weekMatches.findIndex(match => match.includes(1));
  const team1Match = weekMatches.splice(team1MatchIndex, 1)[0];

  // Determine new position for Team 1's match
  let newPosition = (week - 1) % (numberOfTeams / 2);

  // Check if Team 1 is playing against the bye team
  if (byeTeamNumber && team1Match.includes(byeTeamNumber)) {
    // Place Team 1's match at the end if playing against the bye team
    newPosition = numberOfTeams / 2 - 1;
  } else if (byeTeamNumber && newPosition === numberOfTeams / 2 - 1) {
    // Adjust position to avoid last slot if there is a bye team and not playing against it
    newPosition = (newPosition + 1) % (numberOfTeams / 2);
  }

  weekMatches.splice(newPosition, 0, team1Match);
}
