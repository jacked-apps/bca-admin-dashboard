import { PastPlayer } from 'bca-firebase-queries';
import React, { useState } from 'react';
import { EditDataInput } from '../components/EditDataInput';
import { FormValues, profileSchema, formFieldNames } from './profileSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { error } from 'console';

type PastDataEditProps = {
  pastPlayer: PastPlayer;
};

export const PastDataEdit = ({ pastPlayer }: PastDataEditProps) => {
  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: pastPlayer.firstName,
      lastName: pastPlayer.lastName,
      nickname: pastPlayer.nickname,
      phone: pastPlayer.phone,
      address: pastPlayer.address,
      city: pastPlayer.city,
      state: pastPlayer.state,
      zip: pastPlayer.zip,
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  return (
    <div className="confirm-container">
      <div className="confirm-title">PastDataEdit</div>
      <div className="confirm-body">
        <form className="confirm-body-title" onSubmit={handleSubmit(onSubmit)}>
          Please update any old or incorrect information
          <div className="confirm-inputs-wrapper">
            {formFieldNames.map(({ name, label }) => (
              <React.Fragment key={name}>
                <div className="edit-input-container">
                  <div>{label}:</div>
                  <input
                    id={name}
                    {...register(name as keyof FormValues)}
                    type="text"
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
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
