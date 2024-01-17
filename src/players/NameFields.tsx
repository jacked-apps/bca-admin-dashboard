import React from 'react';
import { Names, PastPlayer } from '../assets/types';
import { nameFields } from './buttonFields';
import { formatName } from '../assets/globalFunctions';
import { Fetches, Updates } from '../firebase/firebaseFunctions';
import { validatePastPlayerFields } from '../assets/validateFields';
type Props = {
  pastPlayer: PastPlayer;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};

export const NameFields = ({ pastPlayer, setChosenPastPlayer }: Props) => {
  const handleClick = async (fieldName: keyof Names, name: string) => {
    let newValue = prompt(`Enter a new value for ${name}`, '');
    if (newValue === null || newValue === '') return;
    if (fieldName !== 'nickname') {
      newValue = formatName(newValue);
    }
    const validated = validatePastPlayerFields(fieldName, newValue);
    if (!validated) {
      alert('Invalid value');
      return;
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
  const updatePlayer = async (fieldName: keyof Names, value: string) => {
    const userId = pastPlayer.currentUserId || null;
    try {
      Updates.updatePastPlayerProfile(pastPlayer.email, {
        [fieldName]: value,
      });
      userId &&
        Updates.updateUserProfile(userId, {
          [fieldName]: value,
        });
      alert(`${fieldName} updated successfully`);
    } catch (error) {
      console.log('Error updating pastPlayer', error);
    }
  };
  return (
    <>
      {nameFields.map(field => {
        const fieldName = field.fieldName as keyof Names;
        return (
          <React.Fragment key={field.fieldName}>
            <div className='grid-label'>{field.name}:</div>
            <button
              className='grid-value text-button'
              onClick={() => handleClick(fieldName, pastPlayer[fieldName])}
            >
              {pastPlayer[fieldName]}
            </button>
          </React.Fragment>
        );
      })}
    </>
  );
};
