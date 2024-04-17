// react
import React from 'react';
import { useAuthContext } from '../context/useAuthContext';

// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormValues, newPlayerSchema, formFieldNames } from './newPlayerSchema';

// functions
import {
  capitalizeField,
  formatPhoneNumber,
} from '../assets/formatEntryFunctions';
//css
import './newPlayers.css';

import { useCreatePlayer, BarePlayer, Email } from 'bca-firebase-queries';
import { LogoutButton } from '../login/LogoutButton';

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

  const { createPlayer } = useCreatePlayer();
  const dob = watch('dob');

  const onSubmit = (data: FormValues) => {
    console.log('form data right away', data);
    const playerData: BarePlayer = {
      firstName: capitalizeField(data.firstName),
      lastName: capitalizeField(data.lastName),
      nickname: data.nickname,
      phone: formatPhoneNumber(data.phone),
      address: capitalizeField(data.address),
      dob: dob,
      city: capitalizeField(data.city),
      state: capitalizeField(data.state),
      zip: data.zip,
      email: user?.email as Email,
    };
    console.log('player data to save', playerData);

    if (user) {
      console.log('inside If user', playerData);
      createPlayer(user.uid, playerData);
    }
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
          <LogoutButton />
        </div>
      </form>
    </div>
  );
};
