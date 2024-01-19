import React, { useState } from 'react';
import { Names, PastPlayer } from '../assets/types';
import { nameFields } from './buttonFields';
import { formatName } from '../assets/globalFunctions';
import { Reads, Updates } from '../firebase/firebaseFunctions';
import { validatePastPlayerFields } from '../assets/validateFields';
import { FieldEntryDialog } from '../components/FieldEntryDialog';
type Props = {
  pastPlayer: PastPlayer;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};

export const NameFields = ({ pastPlayer, setChosenPastPlayer }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const [currentFieldName, setCurrentFieldName] = useState<keyof Names | null>(
    null,
  );

  const handleDialogOpen = (fieldName: keyof Names, name: string) => {
    setTitle(`Enter a new ${name}`);
    setCurrentFieldName(fieldName);
    setIsOpen(true);
  };

  const handleDialogClose = async (value: string) => {
    setIsOpen(false);
    if (!currentFieldName) return;
    let processedValue = value;
    if (!currentFieldName || value === null || value === '') return;
    processedValue =
      currentFieldName !== 'nickname' ? formatName(value) : value;

    const validated = validatePastPlayerFields(
      currentFieldName,
      processedValue,
    );
    if (!validated) {
      alert('Invalid value');
      return;
    }
    try {
      await updatePlayer(currentFieldName, processedValue);
      const updatedPlayer = await Reads.fetchPastPlayerData(pastPlayer.email); //refetch pastPlayer
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
    setCurrentFieldName(null);
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
              onClick={() => handleDialogOpen(fieldName, field.name)}
            >
              {pastPlayer[fieldName]}
            </button>
          </React.Fragment>
        );
      })}
      <FieldEntryDialog<string>
        title={title ? title : ''}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setValue={value => handleDialogClose(value)}
      />
    </>
  );
};
