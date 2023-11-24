import { useCallback, useEffect, useState } from 'react';
import { useFetchSeasons } from '../assets/customHooks';
import { SeasonList } from '../seasons/SeasonList';

import './schedule.css';
import { Holiday, Schedule } from '../assets/types';
import { createBasicSchedule } from '../assets/globalFunctions';
import { notDate } from '../assets/globalVariables';
import { convertTimestampToDate } from '../assets/dateFunctions';
import { ScheduleView } from './ScheduleView';
import { HolidayView } from './HolidayView';

export const Scheduler = () => {
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const [editedSchedule, setEditedSchedule] = useState<Schedule>({});

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
    getBasicSchedule();
  }, [selectedSeason, getBasicSchedule]);

  return (
    <div>
      {selectedSeason && <div>{selectedSeason.seasonName}</div>}
      <div className='container'>
        {!selectedSeason && (
          <SeasonList
            seasons={seasons}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
          />
        )}
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
