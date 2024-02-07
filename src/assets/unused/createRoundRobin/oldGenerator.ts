// this code seems to create a schedule for 12 teams to play 16 weeks

import { RoundRobinSchedule, TableMatchup } from '../assets/types';

// to play each other team and play in each table an equal number of times
export const oldRoundRobinGenerator = (): RoundRobinSchedule => {
  const teams = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const numWeeks = 16;
  const numGamesPerWeek = teams.length / 2;
  const schedule: TableMatchup[][] = [];
  // Generate schedule for the first week
  const week1: TableMatchup[] = [];
  const numGame1PerTeam = new Map();
  for (let i = 0; i < teams.length; i += 2) {
    week1.push([teams[i], teams[i + 1]] as TableMatchup);
    numGame1PerTeam.set(teams[i], 1);
    numGame1PerTeam.set(teams[i], 1);
    numGame1PerTeam.set(teams[i + 1], 1);
  }
  schedule.push(week1);
  // Generate schedule for remaining weeks using round-robin format
  for (let week = 2; week <= numWeeks; week++) {
    const currentWeek: TableMatchup[] = [];
    const teamPairs: TableMatchup[] = [];
    for (let i = 0; i < numGamesPerWeek; i++) {
      const team1Index = (week + i - 2) % (teams.length - 1);
      let team2Index = (teams.length - 1 - i + week) % (teams.length - 1);
      if (team2Index === team1Index) {
        team2Index = teams.length - 1;
      }
      teamPairs.push([teams[team1Index], teams[team2Index]]);
    }
    for (let i = 0; i < numGamesPerWeek; i++) {
      let team1: number, team2: number;

      if (week % 2 === 0) {
        team1 = teamPairs[i][0];
        team2 = teamPairs[i][1];
      } else {
        team1 = teamPairs[i][1];
        team2 = teamPairs[i][0];
      }
      const game: TableMatchup = [team1, team2];
      currentWeek.push(game);
      // Check if both teams in this game have played in game 1 before
      if (
        i === 0 &&
        numGame1PerTeam.get(game[0]) < 2 &&
        numGame1PerTeam.get(game[1]) < 2
      ) {
        numGame1PerTeam.set(game[0], numGame1PerTeam.get(game[0]) + 1);
        numGame1PerTeam.set(game[1], numGame1PerTeam.get(game[1]) + 1);
        // Swap the first game of this week with the game that satisfies the criteria
        const temp: TableMatchup = currentWeek[0];
        currentWeek[0] = currentWeek[i];
        currentWeek[i] = temp;
      }
    }
    schedule.push(currentWeek);
  }

  const scheduleObject: RoundRobinSchedule = {};
  schedule.forEach((week, index) => {
    const key = `Week ${index + 1}`;
    scheduleObject[key] = week;
  });

  return scheduleObject;
};
