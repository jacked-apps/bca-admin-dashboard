import {
  countRepeatedMatchups,
  generateRoundRobinSchedule,
} from '../assets/globalFunctions';

type CreateMatchesProps = {
  numberOfTeams: number;
};

export const CreateMatches = ({ numberOfTeams }: CreateMatchesProps) => {
  const rawSchedule = generateRoundRobinSchedule(numberOfTeams);
  const repeatedMatchups = countRepeatedMatchups(rawSchedule);
  console.log('raw Schedule: ', repeatedMatchups);
  return <div>CreateMatches</div>;
};
