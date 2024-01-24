import { useCallback, useEffect, useState } from 'react';
import { useFetchSeasons } from '../customHooks/useFetchSeasons';
import { SeasonList } from '../seasons/SeasonList';

import './schedule.css';
import { Schedule } from '../assets/types';
import { createBasicSchedule } from '../assets/globalFunctions';
import { notDate } from '../assets/globalVariables';
import { convertTimestampToDate } from '../assets/dateFunctions';
import { ScheduleView } from './ScheduleView';
import { HolidayView } from './HolidayView';

export const Scheduler = () => {
  const { seasons, selectedSeason, setSelectedSeason, isLoading, error } =
    useFetchSeasons();
  const [editedSchedule, setEditedSchedule] = useState<Schedule>({});

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  const getBasicSchedule = useCallback(() => {
    if (!selectedSeason || selectedSeason.startDate === notDate) {
      setEditedSchedule({});
      return;
    }
    const basicStartDate = convertTimestampToDate(selectedSeason.startDate);
    const basicSchedule = createBasicSchedule(basicStartDate);
    setEditedSchedule(basicSchedule);
  }, [selectedSeason]);

  useEffect(() => {
    if (
      selectedSeason &&
      selectedSeason.schedule &&
      Object.keys(selectedSeason.schedule).length > 1
    ) {
      setEditedSchedule(selectedSeason.schedule);
    } else {
      getBasicSchedule();
    }
  }, [selectedSeason, getBasicSchedule]);

  return (
    <div>
      <div className='container'>
        <SeasonList
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />

        {selectedSeason && (
          <div className='container'>
            <ScheduleView editedSchedule={editedSchedule} />
            <HolidayView
              season={selectedSeason}
              holidays={selectedSeason.holidays}
              editedSchedule={editedSchedule}
              setEditedSchedule={setEditedSchedule}
              getBasicSchedule={getBasicSchedule}
            />
          </div>
        )}
      </div>
    </div>
  );
};
