import { useEffect } from 'react';
import { RoundRobinSchedule } from '../assets/types';
import { Fetches } from '../firebase/firebaseFunctions';
import './matchups.css';

type CreateMatchesProps = {
  numberOfTeams: number;
  schedule: RoundRobinSchedule | null;
  setSchedule: (schedule: RoundRobinSchedule) => void;
};

export const CreateMatches = ({
  numberOfTeams,
  schedule,
  setSchedule,
}: CreateMatchesProps) => {
  useEffect(() => {
    const fetchSchedule = async () => {
      let useNumber = numberOfTeams;
      if (numberOfTeams % 2 === 1) {
        useNumber++;
      }
      try {
        const fetchedSchedule = await Fetches.fetchRoundRobinSchedule(
          useNumber,
        );
        setSchedule(fetchedSchedule);
      } catch (error) {
        console.error('Error fetching schedule', error);
      }
    };
    fetchSchedule();
  }, [numberOfTeams, setSchedule]);

  return (
    <div>
      Create Matches
      <div>
        {schedule &&
          Object.keys(schedule).length > 0 &&
          Object.keys(schedule)
            .sort((a, b) => {
              const weekNumberA = parseInt(a.split(' ')[1]);
              const weekNumberB = parseInt(b.split(' ')[1]);
              return weekNumberA - weekNumberB;
            })
            .map(key => (
              <div key={key} className='schedule-matchups'>
                <div>{key}</div>
                {schedule[key].map((table, index) => (
                  <div key={index}>
                    <div className='indent'>
                      Table {index + 1}: -- home: {table.home} vs. away:{' '}
                      {table.away}
                    </div>
                  </div>
                ))}
              </div>
            ))}
      </div>
    </div>
  );
};
