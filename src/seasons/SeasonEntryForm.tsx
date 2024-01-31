import { useEffect } from 'react';
import './seasons.css';
import { toast } from 'react-toastify';

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
import { Creates } from '../firebase/firebaseFunctions';
import { useSeasons } from '../customHooks/useSeasons';

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
  const { refetchSeasons, setSelectedSeason } = useSeasons();
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(seasonSchema) });

  useEffect(() => {
    register('startDate');
    register('bcaStartDate');
    register('bcaEndDate');
    register('apaStartDate');
    register('apaEndDate');
  }, [register]);

  const handleDateChange = (
    event: 'bca' | 'apa',
    position: 'Start' | 'End',
    value: Date,
  ) => {
    setValue(`${event}${position}Date`, value);
    const setter = event === 'bca' ? setBcaEvent : setApaEvent;
    const object = event === 'bca' ? bcaEvent : apaEvent;
    const key = position.toLowerCase();
    const newObject = {
      ...object,
      [key]: value,
    };
    setter(newObject);
  };

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

  const onSubmit = async (data: FormValues) => {
    // console log to make sure data is checked and used here.
    console.log('Form data', data);
    // Uses state date to save to firebase.  Prop data only passed in to validate the form data
    try {
      const updatedSeasonData = {
        ...seasonData,
        holidays: [...seasonData.holidays, bcaEvent, apaEvent],
      };
      await Creates.addOrUpdateSeason(seasonData.seasonName, updatedSeasonData);
      reset();
      toast.success(
        '\nSeason added successfully!\n\n You can now create another season or press the teams link to add teams to the created seasons',
      );
    } catch (error) {
      console.error('Error adding/updating season', error);
      toast.error(`Failed to update season ${seasonData.seasonName}`);
    } finally {
      await refetchSeasons();

      //setSelectedSeason(seasonData.seasonName);
    }
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='form-group'>
          <label htmlFor='startDate'>Start Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={watch('startDate')}
            onChange={(date: Date) => handleStartDateChange(date)}
          />
          {errors.startDate && (
            <span className='error-message'>{errors.startDate.message}</span>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='game'>Game: </label>
          <select
            className='form-input-select'
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
          {errors.game && (
            <span className='error-message'>{errors.game.message}</span>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='poolHall'>Pool Hall:</label>
          <select
            className='form-input-select'
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
          {errors.poolHall && (
            <span className='error-message'>{errors.poolHall.message}</span>
          )}
        </div>

        <div className='champ-label'>BCA Nationals</div>
        <div className='form-group'>
          <label htmlFor='bcaStartDate'>Start Date:</label>
          <ReactDatePicker
            className='form-input'
            selected={
              bcaEvent.start instanceof Date ? bcaEvent.start : new Date()
            }
            onChange={(date: Date) => handleDateChange('bca', 'Start', date)}
          />
          {errors.bcaStartDate && (
            <span className='error-message'>{errors.bcaStartDate.message}</span>
          )}
        </div>
        <div className='form-group'>
          <label htmlFor='bcaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={bcaEvent.end instanceof Date ? bcaEvent.end : new Date()}
            onChange={(date: Date) => handleDateChange('bca', 'End', date)}
          />
          {errors.bcaEndDate && (
            <span className='error-message'>{errors.bcaEndDate.message}</span>
          )}
        </div>
        <a href={bcaWebsite} target='_blank' rel='noopener noreferrer'>
          Check BCA Dates
        </a>
        <div className='champ-label'>APA Nationals</div>
        <div className='form-group'>
          <label htmlFor='apaStartDate'>Start Date:</label>
          <ReactDatePicker
            className='form-input'
            selected={
              apaEvent.start instanceof Date ? apaEvent.start : new Date()
            }
            onChange={(date: Date) => handleDateChange('apa', 'Start', date)}
          />
          {errors.apaStartDate && (
            <span className='error-message'>{errors.apaStartDate.message}</span>
          )}
        </div>

        <div className='form-group'>
          <label htmlFor='apaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={apaEvent.end instanceof Date ? apaEvent.end : new Date()}
            onChange={(date: Date) => handleDateChange('apa', 'End', date)}
          />
          {errors.apaEndDate && (
            <span className='error-message'>{errors.apaEndDate.message}</span>
          )}
        </div>
        <a href={apaWebsite} target='_blank' rel='noopener noreferrer'>
          Check APA Dates
        </a>
        <div className='submit-button-container'>
          <button type='submit'>Create Season</button>
        </div>
      </form>
    </div>
  );
};
