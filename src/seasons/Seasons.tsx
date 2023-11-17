import React, { useState, useEffect } from 'react';
import { SeasonEntryForm } from './SeasonEntryForm';
import { SeasonEntryDetails } from './SeasonEntryDetails';
import { Season } from '../assets/types';
import { daysOfTheWeek } from '../assets/globalVariables';
import {
  convertTimestampToDate,
  convertDateToTimestamp,
  getTimeOfYear,
} from '../assets/dateFunctions';
import { timestampWeek } from '../assets/globalVariables';
import './seasons.css';
import { buildSeasonName } from '../assets/globalFunctions';

export const Seasons: React.FC = () => {
  //state
  const [bcaStartDate, setBcaStartDate] = useState<Date | null>(null);
  const [bcaEndDate, setBcaEndDate] = useState<Date | null>(null);
  const [apaStartDate, setApaStartDate] = useState<Date | null>(null);
  const [apaEndDate, setApaEndDate] = useState<Date | null>(null);

  //variables
  const seasonLength = 18 * timestampWeek;
  const today = new Date();
  const defaultStartDate = convertDateToTimestamp(today);
  const defaultEndDate = convertDateToTimestamp(
    new Date(defaultStartDate.toDate().getTime() + seasonLength),
  );

  const [seasonData, setSeasonData] = useState<Season>({
    // default values for the Season object
    id: '',
    startDate: defaultStartDate,
    endDate: defaultEndDate,
    game: '',
    holidays: [],
    night: daysOfTheWeek[today.getDay()],
    poolHall: 'Billiard Plaza',
    seasonCompleted: false,
    seasonName: '',
    teams: [],
  });

  useEffect(() => {
    setSeasonData(currentSeasonData => {
      const newStartDate = currentSeasonData.startDate.toDate();
      const newEndDate = convertDateToTimestamp(
        new Date(newStartDate.getTime() + seasonLength),
      );

      const newNight = daysOfTheWeek[newStartDate.getDay()];
      const newSeasonName = buildSeasonName(
        newStartDate,
        currentSeasonData.poolHall,
        currentSeasonData.game,
      );
      return {
        ...currentSeasonData,
        endDate: newEndDate,
        night: newNight,
        seasonName: newSeasonName,
      };
    });
  }, [
    seasonData.startDate,
    seasonData.game,
    seasonData.poolHall,
    seasonLength,
  ]);

  const handleFormChange = (data: Season) => {
    setSeasonData(data);
  };

  return (
    <div className='container'>
      <SeasonEntryForm
        seasonData={seasonData}
        setSeasonData={setSeasonData}
        bcaStartDate={bcaStartDate}
        setBcaStartDate={setBcaStartDate}
        bcaEndDate={bcaEndDate}
        setBcaEndDate={setBcaEndDate}
        apaStartDate={apaStartDate}
        setApaStartDate={setApaStartDate}
        apaEndDate={apaEndDate}
        setApaEndDate={setApaEndDate}
      />

      <SeasonEntryDetails
        seasonData={seasonData}
        bcaStartDate={bcaStartDate}
        bcaEndDate={bcaEndDate}
        apaStartDate={apaStartDate}
        apaEndDate={apaEndDate}
      />
    </div>
  );
};
