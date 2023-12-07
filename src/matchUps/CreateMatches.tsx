import { generateRoundRobinSchedule } from '../createRoundRobin/newRoundRobinGenerator';
import {} from '../createRoundRobin/roundRobinScheduleAlgorithm';
import { RoundRobinSchedule } from '../assets/types';
import {
  fourTeam,
  sixTeam,
  eightTeam,
  fourteenTeam,
} from '../assets/preMadeSchedules';
type CreateMatchesProps = {
  numberOfTeams: number;
};

export const CreateMatches = ({ numberOfTeams }: CreateMatchesProps) => {
  let useSchedule: RoundRobinSchedule;
  let hasByeTeam = false;
  switch (true) {
    // @ts-expect-error: TS7029
    case numberOfTeams % 2 !== 0:
      hasByeTeam = true;
    // falls through
    case numberOfTeams <= 4:
      useSchedule = fourTeam;
      break;
    case numberOfTeams <= 6:
      useSchedule = sixTeam;
      break;
    case numberOfTeams <= 8:
      useSchedule = eightTeam;
      break;
    case numberOfTeams <= 14 && numberOfTeams > 12:
      useSchedule = fourteenTeam;
      break;
    default:
      useSchedule = generateRoundRobinSchedule(numberOfTeams);
  }

  console.log('create Matches: ', useSchedule);

  return (
    <div>
      Create Matches
      <div>
        {Object.keys(fourteenTeam).map(key => (
          <div key={key}>
            {key} {JSON.stringify(fourteenTeam[key])}
          </div>
        ))}
      </div>
      {hasByeTeam && <div>will create bye team</div>}
    </div>
  );
};
