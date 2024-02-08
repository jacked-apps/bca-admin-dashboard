import { useState, useContext } from 'react';

// components
import { HolidayList } from './HolidayList';
import { HolidayDetails } from './HolidayDetails';
import { FinishSchedule } from './FinishSchedule';
import { AddHoliday } from './AddHoliday';
import { ErrorAndRefetch } from '../components/ErrorAndRefetch';

// context
import { SelectedItemContext } from '../context/SelectedItemProvider';

// utilities
import { toast } from 'react-toastify';

// firebase
//import { useSeasons } from '../customHooks/useSeasons';
import { useFetchSeasons } from '../firebase';
//TODO update to RQ
import { updateSeasonSchedule } from '../assets/unused/updates';

// types
import { Schedule, Holiday } from '../assets/typesFolder/seasonTypes';

// css
import './schedule.css';

type HolidayViewProps = {
  editedSchedule: Schedule;
  setEditedSchedule: (schedule: Schedule) => void;
  getBasicSchedule: () => void;
};
export const HolidayView = ({
  editedSchedule,
  setEditedSchedule,
  getBasicSchedule,
}: HolidayViewProps) => {
  const { selectedSeason } = useContext(SelectedItemContext);
  const { isLoading, error, refetch: fetchSeasons } = useFetchSeasons();
  const holidays = selectedSeason?.holidays || [];
  const [editedHolidays, setEditedHolidays] = useState<Holiday[]>(holidays);
  const [activeHoliday, setActiveHoliday] = useState<Holiday | null>(null);
  const [addHoliday, setAddHoliday] = useState<boolean>(false);

  const handleDismissHoliday = (holiday: Holiday) => {
    // remove activeHoliday from holiday array
    const updatedHolidays = editedHolidays.filter(h => h !== holiday);
    setEditedHolidays(updatedHolidays);
    if (activeHoliday === holiday) {
      setActiveHoliday(null);
    }
  };
  const handleAddHoliday = () => {
    setAddHoliday(true);
  };
  const handleSaveSchedule = async () => {
    if (!selectedSeason) {
      toast.error('No season selected to save schedule.');
      return;
    }
    try {
      await updateSeasonSchedule(selectedSeason.seasonName, editedSchedule);
      toast.success(
        `Your new schedule has been added ${selectedSeason.seasonName}.\nChoose a new season or move on to Match Ups.`,
      );
    } catch (error) {
      console.error('Failed to update schedule', error);
      toast.error('Failed to update the schedule please try again.');
    }
  };

  const handleResetSchedule = () => {
    setEditedHolidays(holidays);
    getBasicSchedule();
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error instanceof Error) {
    return <ErrorAndRefetch error={error} onRetry={fetchSeasons} />;
  }
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
      {editedHolidays.length === 0 && !addHoliday && (
        <FinishSchedule
          handleAddHoliday={handleAddHoliday}
          handleResetSchedule={handleResetSchedule}
          handleSaveSchedule={handleSaveSchedule}
        />
      )}
      {editedHolidays.length === 0 && addHoliday && (
        <AddHoliday
          setEditedHolidays={setEditedHolidays}
          setAddHoliday={setAddHoliday}
        />
      )}
    </div>
  );
};
