import React from 'react';
import { PastPlayer } from '../assets/types';
import { PastPlayerProfileFields, profileFields } from './buttonFields';
import { Fetches, Updates } from '../firebase/firebaseFunctions';
import { formatName, formatPhoneNumber } from '../assets/globalFunctions';

type Props = {
  pastPlayer: PastPlayer;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};

export const ProfileFields = ({ pastPlayer, setChosenPastPlayer }: Props) => {
  const handleClick = async (
    fieldName: keyof PastPlayerProfileFields,
    value: string,
    name: string,
  ) => {
    let newValue = prompt(`Enter a new value for ${name}`, value);
    if (newValue === null || newValue === '') return;
    if (fieldName !== 'city') {
      newValue = formatName(newValue);
    }
    if (fieldName === 'phone') {
      newValue = formatPhoneNumber(newValue);
    }
    try {
      await updatePlayer(fieldName, newValue);
      const updatedPlayer = await Fetches.fetchPastPlayerData(pastPlayer.email); //refetch pastPlayer
      if (updatedPlayer) {
        setChosenPastPlayer(updatedPlayer as PastPlayer);
      }
    } catch (error) {
      console.log('Error updating pastPlayer', error);
    }
  };
  const updatePlayer = async (
    fieldName: keyof PastPlayerProfileFields,
    value: string,
  ) => {
    try {
      Updates.updatePastPlayerProfile(pastPlayer.email, {
        [fieldName]: value,
      });
      alert(`${fieldName} updated successfully`);
    } catch (error) {
      console.log('Error updating pastPlayer', error);
    }
  };
  return (
    <>
      {profileFields.map(field => {
        const fieldName = field.fieldName as keyof PastPlayerProfileFields;
        return (
          <React.Fragment key={field.fieldName}>
            <div className='grid-label'>{field.name}:</div>
            <button
              className='grid-value text-button'
              onClick={() =>
                handleClick(fieldName, pastPlayer[fieldName], field.name)
              }
            >
              {pastPlayer[fieldName]}
            </button>
          </React.Fragment>
        );
      })}
    </>
  );
};
