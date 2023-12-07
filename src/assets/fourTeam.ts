type Matchup = [number, number];
type WeeklySchedule = Matchup[];

function generateFourTeamSchedule(
  totalWeeks: number,
): Record<string, WeeklySchedule> {
  const baseSchedule: Record<string, WeeklySchedule> = {
    'Week 1': [
      [1, 2],
      [3, 4],
    ],
    'Week 2': [
      [3, 1],
      [4, 2],
    ],
    'Week 3': [
      [2, 3],
      [1, 4],
    ],
    // ... Define up to Week 12 following your pattern
  };

  const schedule: Record<string, WeeklySchedule> = {};

  for (let week = 1; week <= totalWeeks; week++) {
    const baseWeek = week % 12 === 0 ? 12 : week % 12;
    const weekLabel = `Week ${week}`;
    schedule[weekLabel] = baseSchedule[`Week ${baseWeek}`];
  }

  return schedule;
}

// Example usage:
const fourTeamSchedule = generateFourTeamSchedule(16); // Generates a 16-week schedule
console.log(fourTeamSchedule);
