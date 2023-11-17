import './seasons.css';
import { useForm } from 'react-hook-form';
import { seasonSchema } from './schema';
import { Game, PoolHall, Season } from '../assets/types';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  games,
  poolHalls,
  bcaWebsite,
  apaWebsite,
} from '../assets/globalVariables';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCallback, useEffect } from 'react';
import {
  convertDateToTimestamp,
  convertTimestampToDate,
  toJSDate,
} from '../assets/dateFunctions';

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
  bcaStartDate: Date | null;
  setBcaStartDate: (date: Date | null) => void;
  bcaEndDate: Date | null;
  setBcaEndDate: (date: Date | null) => void;
  apaStartDate: Date | null;
  setApaStartDate: (date: Date | null) => void;
  apaEndDate: Date | null;
  setApaEndDate: (date: Date | null) => void;
};

export const SeasonEntryForm: React.FC<SeasonEntryFormProps> = ({
  seasonData,
  setSeasonData,
  bcaStartDate,
  setBcaStartDate,
  bcaEndDate,
  setBcaEndDate,
  apaStartDate,
  setApaStartDate,
  apaEndDate,
  setApaEndDate,
}) => {
  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({ resolver: yupResolver(seasonSchema) });

  const watchedStartDate = watch('startDate');
  const watchedGame = watch('game');
  const watchedPoolHall = watch('poolHall');
  useEffect(() => {
    register('startDate');
    register('bcaStartDate');
    register('bcaEndDate');
    register('apaStartDate');
    register('apaEndDate');
  }, [register]);

  const updateUserData = useCallback(() => {
    let hasChanged = false;
    const newData = { ...seasonData };

    if (watchedGame !== seasonData.game) {
      newData.game = watchedGame;
      hasChanged = true;
    }
    if (watchedPoolHall !== seasonData.poolHall) {
      newData.poolHall = watchedPoolHall;
      hasChanged = true;
    }
    const watchedStartDateTimestamp = convertDateToTimestamp(watchedStartDate);
    const seasonStartDateTimestamp = convertDateToTimestamp(
      seasonData.startDate.toDate(),
    );

    if (
      watchedStartDateTimestamp !== 'Invalid Date' &&
      seasonStartDateTimestamp !== 'Invalid Date'
    ) {
      if (
        watchedStartDateTimestamp.toMillis() !==
        seasonStartDateTimestamp.toMillis()
      ) {
        newData.startDate = watchedStartDateTimestamp;
        hasChanged = true;
      }
    }

    if (hasChanged) {
      setSeasonData(newData);
    }
  }, [
    watchedGame,
    watchedPoolHall,
    seasonData,
    watchedStartDate,
    setSeasonData,
  ]);

  useEffect(() => {
    updateUserData();
  }, [watchedGame, watchedPoolHall, watchedStartDate, updateUserData]);

  const onSubmit = (data: FormValues) => {
    console.log(data);
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
            onChange={(date: Date) => setValue('startDate', date)}
          />
          {errors.startDate && <span>{errors.startDate.message}</span>}
        </div>
        <div>
          <label htmlFor='game'>Game: </label>
          <select
            className='form-input-game'
            id='game'
            {...register('game', { required: true })}
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
            selected={bcaStartDate}
            onChange={(date: Date) => setBcaStartDate(date)}
          />
          {errors.bcaStartDate && <span>{errors.bcaStartDate.message}</span>}
        </div>
        <div>
          <label htmlFor='bcaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={bcaEndDate}
            onChange={(date: Date) => setBcaEndDate(date)}
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
            selected={apaStartDate}
            onChange={(date: Date) => setApaStartDate(date)}
          />
          {errors.apaStartDate && <span>{errors.apaStartDate.message}</span>}
        </div>

        <div>
          <label htmlFor='apaEndDate'>End Date: </label>
          <ReactDatePicker
            className='form-input'
            selected={apaEndDate}
            onChange={(date: Date) => setApaEndDate(date)}
          />
          {errors.apaEndDate && <span>{errors.apaEndDate.message}</span>}
        </div>
        <a href={apaWebsite} target='_blank' rel='noopener noreferrer'>
          Check APA Dates
        </a>
        <input
          type='hidden'
          {...register('bcaStartDate')}
          value={
            bcaStartDate ? bcaStartDate.toISOString().substring(0, 10) : ''
          }
        />
        <input
          type='hidden'
          {...register('bcaEndDate')}
          value={bcaEndDate ? bcaEndDate.toISOString().substring(0, 10) : ''}
        />
        <input
          type='hidden'
          {...register('apaStartDate')}
          value={
            apaStartDate ? apaStartDate.toISOString().substring(0, 10) : ''
          }
        />
        <input
          type='hidden'
          {...register('apaEndDate')}
          value={apaEndDate ? apaEndDate.toISOString().substring(0, 10) : ''}
        />
      </form>
    </div>
  );
};
