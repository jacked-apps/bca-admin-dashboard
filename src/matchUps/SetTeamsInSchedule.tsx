import { useMemo, useState } from 'react';
import {
  RoundRobinSchedule,
  Team,
  RoundRobinScheduleFinished,
} from '../assets/types';
import './matchups.css';
import { Posts } from '../firebase/firebaseFunctions';

type SetTeamsInScheduleProps = {
  teamOrder: Team[];
  schedule: RoundRobinSchedule | null;
  setFinishedSchedule: (
    finishedSchedule: RoundRobinScheduleFinished | null,
  ) => void;
  finishedSchedule: RoundRobinScheduleFinished | null;
  seasonId: string;
};
export const SetTeamsInSchedule = ({
  teamOrder,
  schedule,
  finishedSchedule,
  setFinishedSchedule,
  seasonId,
}: SetTeamsInScheduleProps) => {
  const [inserted, setInserted] = useState(!!finishedSchedule);

  const useTeamOrder = useMemo(() => {
    const order = teamOrder.map(team => {
      return { teamName: team.teamName, id: team.id };
    });

    if (teamOrder.length % 2 !== 0) {
      const byeTeam = { id: 'bye', teamName: 'Bye' };
      order.push(byeTeam);
    }
    return order;
  }, [teamOrder]);

  const handleRevert = () => {
    setFinishedSchedule(null);
    setInserted(false);
  };

  const handleSave = async () => {
    if (!finishedSchedule) {
      return;
    }
    try {
      await Posts.addFinishedRoundRobin(seasonId, finishedSchedule);
      alert(`Finished schedule added to ${seasonId} successfully`);
    } catch (error) {
      console.error(`Error adding finished schedule: ${error}`);
      alert('An Error occurred while saving this schedule');
    }
  };

  const handleInsertTeams = () => {
    const finishedRoundRobin: RoundRobinScheduleFinished = {};
    if (schedule) {
      const scheduleKeys = Object.keys(schedule);
      scheduleKeys.forEach(week => {
        const weekArray = schedule[week];
        const finishedWeekArray = weekArray.map(match => {
          const homeTeamNumber = match.home - 1;
          const awayTeamNumber = match.away - 1;

          return {
            home: {
              teamName: useTeamOrder[homeTeamNumber].teamName,
              id: useTeamOrder[homeTeamNumber].id,
            },
            away: {
              teamName: useTeamOrder[awayTeamNumber].teamName,
              id: useTeamOrder[awayTeamNumber].id,
            },
          };
        });
        finishedRoundRobin[week] = finishedWeekArray;
      });
    }
    setFinishedSchedule(finishedRoundRobin);
    setInserted(true);
  };

  return (
    <div className='set-team-button'>
      {inserted ? (
        <button onClick={handleRevert}>Revert</button>
      ) : (
        <button onClick={handleInsertTeams}>
          Insert Teams
          <br />
          Into Schedule
        </button>
      )}
      {inserted && (
        <button className='indent' onClick={handleSave}>
          Save
        </button>
      )}
    </div>
  );
};
