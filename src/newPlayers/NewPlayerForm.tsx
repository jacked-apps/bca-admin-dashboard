import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormValues, newPlayerSchema, formFieldNames } from './newPlayerSchema';
import './newPlayers.css';
import {
  capitalizeField,
  formatPhoneNumber,
} from '../assets/formatEntryFunctions';
import { useAuthContext } from '../context/useAuthContext';
export const NewPlayerForm = () => {
  const { user } = useAuthContext();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(newPlayerSchema),
    defaultValues: {
      email: user?.email as string,
    },
  });
  const dob = watch('dob');
  const onSubmit = (data: FormValues) => {
    console.log(data);
    console.log(
      'formatter:',
      capitalizeField(data.address),
      formatPhoneNumber(data.phone)
    );
  };
  const testSubmit = () => {
    console.log('dob:', dob, typeof dob);
  };
  return (
    <div>
      <div className="form-title">
        We need the following data for all new players
      </div>
      <form className="confirm-body-title" onSubmit={handleSubmit(onSubmit)}>
        <div>
          {formFieldNames.map(({ name, label }) => (
            <React.Fragment key={name}>
              <div className="edit-input-container">
                <div>{label}:</div>
                <input
                  disabled={name === 'email' ? true : false}
                  id={name}
                  {...register(name as keyof FormValues)}
                  type={name === 'dob' ? 'date' : 'text'}
                  className={
                    errors[name as keyof FormValues]
                      ? 'input-error'
                      : 'edit-input'
                  }
                />
              </div>
              {errors[name as keyof FormValues] && (
                <div className="error-message">
                  {errors[name as keyof FormValues]?.message}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="form-button-wrapper">
          <button type="submit">Submit</button>
          <button onClick={testSubmit}>test</button>
        </div>
      </form>
    </div>
  );
};
