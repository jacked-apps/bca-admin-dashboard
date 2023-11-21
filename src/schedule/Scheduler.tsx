import { useCallback, useEffect, useState } from 'react';
import { useFetchSeasons } from '../assets/customHooks';
import { SeasonList } from '../seasons/SeasonList';

import './schedule.css';
import { Schedule } from '../assets/types';
import { createBasicSchedule } from '../assets/globalFunctions';
import { notDate } from '../assets/globalVariables';
import { convertTimestampToDate } from '../assets/dateFunctions';

export const Scheduler = () => {
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const [schedule, setSchedule] = useState<Schedule>({});

  const getBasicSchedule = useCallback(() => {
    if (!selectedSeason || selectedSeason.startDate === notDate) {
      setSchedule({});
      return;
    }
    const basicStartDate = convertTimestampToDate(selectedSeason.startDate);
    const basicSchedule = createBasicSchedule(basicStartDate);
    setSchedule(basicSchedule);
  }, [selectedSeason]);

  useEffect(() => {
    getBasicSchedule();
  }, [selectedSeason, getBasicSchedule]);

  console.log('SCHEDULE selectedSeason', schedule);
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
