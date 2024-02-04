import { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
//css
import './seasons.css';
import 'react-datepicker/dist/react-datepicker.css';

// form
import { useForm } from 'react-hook-form';
import { seasonSchema } from './schema';
import { yupResolver } from '@hookform/resolvers/yup';

// components
import ReactDatePicker from 'react-datepicker';
import { LeagueDates } from './LeagueDates';
import { FormSelect } from './FormSelect';

// types
import { Game, Holiday, PoolHall, Season } from '../assets/types';
import { FormValues } from './seasonTypes';

// functions
import { convertDateToTimestamp } from '../assets/dateFunctions';
import { buildSeasonName, fetchHolidays } from '../assets/globalFunctions';
// variables
import {
  games,
  poolHalls,
  bcaWebsite,
  apaWebsite,
  seasonLength,
  daysOfTheWeek,
} from '../assets/globalVariables';
import { SelectedSeasonContext } from '../context/SelectedSeasonProvider';
import {
  fetchSeasonRQ,
  useAddOrUpdateSeason,
  useFetchSeasons,
} from '../firebase';

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
  const { setSelectedSeason } = useContext(SelectedSeasonContext);
  const { mutate: addOrUpdateSeason } = useAddOrUpdateSeason({
    useToast: false,
  });
  const { refetchSeasons } = useFetchSeasons();
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
    let seasonExists = false;
    const updatedSeasonData = {
      ...seasonData,
      holidays: [...seasonData.holidays, bcaEvent, apaEvent],
    };
    let confirm = true;
    try {
      //await Creates.addOrUpdateSeason(seasonData.seasonName, updatedSeasonData);
      await fetchSeasonRQ(seasonData.seasonName);
      seasonExists = true;
      confirm = window.confirm(
        'Season already exists.  Do you want to update this season?',
      );
      // confirm with user to update this season
    } catch (error) {
      console.info('Season does not exist proceed');
    }
    if (!confirm) {
      return;
    }
    if (!seasonExists) {
      addOrUpdateSeason({
        seasonName: updatedSeasonData.seasonName,
        seasonData: updatedSeasonData,
      });
    }
    setSelectedSeason(updatedSeasonData);
    refetchSeasons();
    reset();
    toast.success(
      '\nSeason added successfully!\n\n You can now create another season or press the teams link to add teams to the created seasons',
    );
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
        <FormSelect
          label='Game'
          fieldName='game'
          register={register}
          choices={games}
          onChange={e => handleStringChange('game', e.target.value)}
          errorMessage={errors.game && errors.game.message}
        />
        <FormSelect
          label='Pool Hall'
          fieldName='poolHall'
          register={register}
          choices={poolHalls}
          onChange={e => handleStringChange('poolHall', e.target.value)}
          errorMessage={errors.poolHall && errors.poolHall.message}
        />

        <LeagueDates
          league='bca'
          startDate={
            bcaEvent.start instanceof Date ? bcaEvent.start : new Date()
          }
          endDate={bcaEvent.end instanceof Date ? bcaEvent.end : new Date()}
          onStartChange={(date: Date) => handleDateChange('bca', 'Start', date)}
          onEndChange={(date: Date) => handleDateChange('bca', 'End', date)}
          website={bcaWebsite}
          startError={errors.bcaStartDate?.message}
          endError={errors.bcaEndDate?.message}
        />
        <LeagueDates
          league='apa'
          startDate={
            apaEvent.start instanceof Date ? apaEvent.start : new Date()
          }
          endDate={apaEvent.end instanceof Date ? apaEvent.end : new Date()}
          onStartChange={(date: Date) => handleDateChange('apa', 'Start', date)}
          onEndChange={(date: Date) => handleDateChange('apa', 'End', date)}
          website={apaWebsite}
          startError={errors.apaStartDate?.message}
          endError={errors.apaEndDate?.message}
        />

        <div className='submit-button-container'>
          <button type='submit'>Create Season</button>
        </div>
      </form>
    </div>
  );
};
