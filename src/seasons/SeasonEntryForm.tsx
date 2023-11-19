import { useEffect } from 'react';
import './seasons.css';
// form
import { useForm } from 'react-hook-form';
import { seasonSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';
// date picker
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// variables and functions
import { convertDateToTimestamp } from '../assets/dateFunctions';
import { buildSeasonName, fetchHolidays } from '../assets/globalFunctions';
import {
  games,
  poolHalls,
  bcaWebsite,
  apaWebsite,
  seasonLength,
  daysOfTheWeek,
} from '../assets/globalVariables';

// types
import { Game, Holiday, PoolHall, Season } from '../assets/types';

type FormValues = {
  poolHall: PoolHall;
  startDate: Date;
  game: Game;
  bcaStartDate: Date;
  bcaEndDate: Date;
  apaStartDate: Date;
  apaEndDate: Date;
};

type SeasonEntryFormProps = {
  seasonData: Season;
  setSeasonData: (data: Season) => void;
  bcaEvent: Holiday;
  setBcaEvent: (date: Holiday) => void;
  apaEvent: Holiday;
  setApaEvent: (date: Holiday) => void;
};

export const SeasonEntryForm: React.FC<SeasonEntryFormProps> = ({
  seasonData,
  setSeasonData,
  bcaEvent,
  setBcaEvent,
  apaEvent,
  setApaEvent,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(seasonSchema) });

  useEffect(() => {
    register('startDate');
    register('bcaStartDate');
    register('bcaEndDate');
    register('apaStartDate');
    register('apaEndDate');
  }, [register]);

  const handleDateChange = () => {};

  const handleStartDateChange = (newValue: Date) => {
    // update form
    setValue('startDate', newValue);
    // things to update
    const startDate = convertDateToTimestamp(newValue);
    const endDate = convertDateToTimestamp(
      new Date(newValue.getTime() + seasonLength),
    );
    const night = daysOfTheWeek[newValue.getDay()];
    const holidays = fetchHolidays(newValue);
    const seasonName = buildSeasonName(
      newValue,
      seasonData.poolHall,
      seasonData.game,
    );
    const updatedData: Season = {
      ...seasonData,
      startDate,
      seasonName,
      endDate,
      night,
      holidays,
    };
    setSeasonData(updatedData);
  };

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const handleStringChange = (
    fieldName: 'poolHall' | 'game',
    newValue: string,
  ) => {
    setValue(fieldName, newValue as PoolHall | Game);

    // Create a new seasonData object with the updated field value
    const newSeasonName = buildSeasonName(
      seasonData.startDate,
      fieldName === 'poolHall' ? (newValue as PoolHall) : seasonData.poolHall,
      fieldName === 'game' ? (newValue as Game) : seasonData.game,
    );

    const updatedData: Season = {
      ...seasonData,
      seasonName: newSeasonName,
      [fieldName]: newValue, // Dynamically update the field based on fieldName
    };

    // Directly set the new seasonData state
    setSeasonData(updatedData);
  };

  return (
    <div className='form-container'>
      <div className='season-title'>Build a Season</div>
      <form onSubmit={handleSubmit(onSubmit)} className='form-Container'>
        <div>
          <label htmlFor='startDate'>Start Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={watch('startDate')}
            onChange={(date: Date) => handleStartDateChange(date)}
          />
          {errors.startDate && <span>{errors.startDate.message}</span>}
        </div>
        <div>
          <label htmlFor='game'>Game: </label>
          <select
            className='form-input-game'
            id='game'
            {...register('game', { required: true })}
            onChange={e => handleStringChange('game', e.target.value)}
          >
            {games.map((game, index) => (
              <option key={index} value={game}>
                {game}
              </option>
            ))}
          </select>
          {errors.game && <span>{errors.game.message}</span>}
        </div>
        <div>
          <label htmlFor='poolHall'>Pool Hall:</label>
          <select
            className='form-input-hall'
            id='poolHall'
            {...register('poolHall', { required: true })}
            onChange={e => handleStringChange('poolHall', e.target.value)}
          >
            {poolHalls.map((poolHall, index) => (
              <option key={index} value={poolHall}>
                {poolHall}
              </option>
            ))}
          </select>
          {errors.poolHall && <span>{errors.poolHall.message}</span>}
        </div>

        <div>
          <div className='champ-label'>BCA Nationals</div>
          <label htmlFor='bcaStartDate'>Start Date:</label>
          <ReactDatePicker
            className='form-input'
            selected={
              bcaEvent.start instanceof Date ? bcaEvent.start : new Date()
            }
            onChange={(date: Date) => handleDateChange('bcaStartDate', date)}
          />
          {errors.bcaStartDate && <span>{errors.bcaStartDate.message}</span>}
        </div>
        <div>
          <label htmlFor='bcaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={bcaEvent.end instanceof Date ? bcaEvent.end : new Date()}
            onChange={(date: Date) => handleDateChange('bcaEndDate', date)}
          />
          {errors.bcaEndDate && <span>{errors.bcaEndDate.message}</span>}
        </div>
        <a href={bcaWebsite} target='_blank' rel='noopener noreferrer'>
          Check BCA Dates
        </a>
        <div>
          <div className='champ-label'>APA Nationals</div>
          <label htmlFor='apaStartDate'>Start Date:</label>
          <ReactDatePicker
            className='form-input'
            selected={
              apaEvent.start instanceof Date ? apaEvent.start : new Date()
            }
            onChange={(date: Date) => handleDateChange('apaStartDate', date)}
          />
          {errors.apaStartDate && <span>{errors.apaStartDate.message}</span>}
        </div>

        <div>
          <label htmlFor='apaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={apaEvent.end instanceof Date ? apaEvent.end : new Date()}
            onChange={(date: Date) => handleDateChange('apaEndDate', date)}
          />
          {errors.apaEndDate && <span>{errors.apaEndDate.message}</span>}
        </div>
        <a href={apaWebsite} target='_blank' rel='noopener noreferrer'>
          Check APA Dates
        </a>
      </form>
    </div>
  );
};
