import { Schedule } from '../assets/types';
import './schedule.css';

type ScheduleViewProps = {
  editedSchedule: Schedule;
};
export const ScheduleView = ({ editedSchedule }: ScheduleViewProps) => {
  return (
    <div className='schedule-view-container'>
      <div className='view-title'>Schedule:</div>

      {editedSchedule &&
        Object.entries(editedSchedule).map(([key, value]) => {
          return (
            <div className='view-group' key={key}>
              <div>{value.title}:</div>
              <div>{key}</div>
            </div>
          );
        })}
    </div>
  );
};
