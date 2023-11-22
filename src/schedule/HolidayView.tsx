import { useState } from 'react';
import { Holiday, Schedule, Season } from '../assets/types';
import './schedule.css';
import { HolidayList } from './HolidayList';
import { HolidayDetails } from './HolidayDetails';
import { FinishSchedule } from './FinishSchedule';

type HolidayViewProps = {
  season: Season;
  holidays: Holiday[];
  editedSchedule: Schedule;
  setEditedSchedule: (schedule: Schedule) => void;
};
export const HolidayView = ({
  season,
  holidays,
  editedSchedule,
  setEditedSchedule,
}: HolidayViewProps) => {
  const [editedHolidays, setEditedHolidays] = useState<Holiday[]>(holidays);
  const [activeHoliday, setActiveHoliday] = useState<Holiday | null>(null);

  const handleDismissHoliday = (holiday: Holiday) => {
    // remove activeHoliday from holiday array
    const updatedHolidays = editedHolidays.filter(h => h !== holiday);
    setEditedHolidays(updatedHolidays);
    if (activeHoliday === holiday) {
      setActiveHoliday(null);
    }
  };

  return (
    <div className='holiday-view-container'>
      <div className='view-title'>Holidays</div>
      {!activeHoliday && (
        <HolidayList
          handleDismissHoliday={handleDismissHoliday}
          editedHolidays={editedHolidays}
          setActiveHoliday={setActiveHoliday}
        />
      )}
      {activeHoliday && (
        <HolidayDetails
          editedSchedule={editedSchedule}
          setEditedSchedule={setEditedSchedule}
          activeHoliday={activeHoliday}
          handleDismissHoliday={handleDismissHoliday}
          setActiveHoliday={setActiveHoliday}
        />
      )}
      {editedHolidays.length === 0 && <FinishSchedule />}
    </div>
  );
};
