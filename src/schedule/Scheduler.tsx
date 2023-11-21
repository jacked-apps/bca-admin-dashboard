import { useState } from 'react';
import { useFetchSeasons } from '../assets/customHooks';
import { SeasonList } from '../seasons/SeasonList';

import './schedule.css';
import { Schedule } from '../assets/types';

export const Scheduler = () => {
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const [schedule, setSchedule] = useState<Schedule>({});
  console.log('SCHEDULE selectedSeason', selectedSeason);
  return (
    <div className='container'>
      {!selectedSeason && (
        <SeasonList
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
      )}
      {selectedSeason && <div>Schedule</div>}
    </div>
  );
};
