import * as yup from 'yup';
import { poolHalls, games } from '../assets/globalVariables';

export const seasonSchema = yup.object().shape({
  startDate: yup.date().required('Start date is required'),
  game: yup.string().oneOf(games).required('Game is required'),
  poolHall: yup.string().oneOf(poolHalls).required('Pool hall is required'),

  bcaStartDate: yup.date().required('BCA start date is required'),
  bcaEndDate: yup
    .date()
    .required('BCA end date is required')
    .when('bcaStartDate', (bcaStartDate, schema) => {
      return schema.min(
        bcaStartDate,
        'BCA end date must be after the start date',
      );
    }),

  apaStartDate: yup.date().required('APA start date is required'),
  apaEndDate: yup
    .date()
    .required('APA end date is required')
    .when('apaStartDate', (apaStartDate, schema) => {
      return schema.min(
        apaStartDate,
        'APA end date must be after the start date',
      );
    }),
});
