import { useState } from 'react';
// Types
import { Holiday, Season } from '../assets/types';
// Components
import { SeasonEntryForm } from './SeasonEntryForm';
import { SeasonEntryDetails } from './SeasonEntryDetails';
// Variables and Functions
import { daysOfTheWeek, initialSchedule } from '../assets/globalVariables';
import {
  convertDateToTimestamp,
  getSeasonEndDate,
} from '../assets/dateFunctions';
import { createHolidayObject } from '../assets/globalFunctions';
// CSS
import './seasons.css';

export const Seasons: React.FC = () => {
  //state
  const [bcaEvent, setBcaEvent] = useState<Holiday>(
    createHolidayObject(new Date(), new Date(), 'bca'),
  );
  const [apaEvent, setApaEvent] = useState<Holiday>(
    createHolidayObject(new Date(), new Date(), 'apa'),
  );

  //variables
  const today = new Date();
  const defaultStartDate = convertDateToTimestamp(today);

  const defaultEndDate = getSeasonEndDate(defaultStartDate);

  const [seasonData, setSeasonData] = useState<Season>({
    // default values for the Season object
    id: '',
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    game: '9 Ball',
    holidays: [],
    night: daysOfTheWeek[today.getDay()],
    poolHall: 'Billiard Plaza',
    seasonCompleted: false,
    seasonName: '',
    teams: [],
    schedule: { ...initialSchedule },
  });

  return (
    <div className='container'>
      <SeasonEntryForm
        seasonData={seasonData}
        setSeasonData={setSeasonData}
        bcaEvent={bcaEvent}
        setBcaEvent={setBcaEvent}
        apaEvent={apaEvent}
        setApaEvent={setApaEvent}
      />

      <SeasonEntryDetails
        seasonData={seasonData}
        bcaEvent={bcaEvent}
        apaEvent={apaEvent}
      />
    </div>
  );
};
