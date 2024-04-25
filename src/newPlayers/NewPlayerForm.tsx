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

// firebase
import { useCreatePlayer, BarePlayer, Email } from 'bca-firebase-queries';

// components
import { LogoutButton } from '../login/LogoutButton';
import './newPlayers.css';

//css
import { toast } from 'react-toastify';
import { InfoButton } from '../components/InfoButton';
import { useCreatedEntityNavigation } from '../hooks/useCreatedEntityNavigation';

export const NewPlayerForm = () => {
  // constants
  const { user } = useAuthContext();
  const { createPlayer, isLoading, isError, error } = useCreatePlayer();
  const { playerCreated } = useCreatedEntityNavigation();

  // form create
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(newPlayerSchema),
    defaultValues: {
      email: user?.email as string,
    },
  });

  // submit handler
  const onSubmit = (data: FormValues) => {
    const playerData: BarePlayer = {
      firstName: capitalizeField(data.firstName),
      lastName: capitalizeField(data.lastName),
      nickname: data.nickname,
      phone: formatPhoneNumber(data.phone),
      address: capitalizeField(data.address),
      dob: data.dob,
      city: capitalizeField(data.city),
      state: capitalizeField(data.state),
      zip: data.zip,
      email: user?.email as Email,
    };

    if (user) {
      const onSuccess = async () => {
        toast.success('Player created successfully!');
        playerCreated();
      };
      createPlayer(user.uid, playerData, onSuccess);
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
                <div className="input-label">
                  {name === 'email' && (
                    <InfoButton infoBlurbKey="emailChangeProhibited" />
                  )}
                  {label}:
                </div>

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
          {isError && (
            <div>
              Something went wrong...{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}
        </div>
        {!isLoading && (
          <div className="form-button-wrapper">
            <button type="submit" disabled={isLoading}>
              Submit
            </button>
            <LogoutButton disabled={isLoading} />
          </div>
        )}
      </form>
    </div>
  );
};
