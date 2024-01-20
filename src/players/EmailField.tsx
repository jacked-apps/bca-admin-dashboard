import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { PastPlayer } from '../assets/types';
import { Reads, Creates, Deletes } from '../firebase/firebaseFunctions';
import { FieldEntryDialog } from '../components/FieldEntryDialog';
import { failedUpdate, updateSuccess } from '../firebase/firebaseConsts';
import { validatePastPlayerFields } from '../assets/validateFields';

type Props = {
  pastPlayer: PastPlayer;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};

export const EmailField = ({ pastPlayer, setChosenPastPlayer }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);

  const handleDialogOpen = () => {
    setTitle(`Enter a new Email`);
    setIsOpen(true);
  };

  const handleDialogClose = async (value: string) => {
    setIsOpen(false);
    const validated = validatePastPlayerFields('email', value);
    if (!validated) {
      toast.warn('Not a valid email');
    }
    toast(
      '🦄 To change email we must create an entire new player and remove the old one',
      { autoClose: 5000 },
    );
    try {
      // save pastPlayer data in a new variable called updatedPlayer
      const oldEmail = pastPlayer.id.toLowerCase();
      console.log('old Email: ', oldEmail);
      const updatedPlayer = pastPlayer;

      // change the email in updatedPlayer to the newValue
      updatedPlayer.email = value.toLowerCase();
      updatedPlayer.id = value.toLowerCase();

      // create a new document in pastPlayers with the newValue as the id and the data from updatedPlayer
      const { success, message } = await Creates.createPastPlayer(
        updatedPlayer,
      );
      if (!success) {
        toast.error(message);
        return;
      }

      console.log('old emails: ', pastPlayer.email, oldEmail);
      // fetch the newPlayer and set it to the chosenPastPlayer
      toast.success(`Email ${updateSuccess}`);

      const newPlayer = await Reads.fetchPastPlayerData(updatedPlayer.email);
      if (!newPlayer) {
        toast.error(`${failedUpdate} Player profile`);
        return;
      }
      setChosenPastPlayer(newPlayer as PastPlayer);
      // delete the old document
      //await Deletes.deletePastPlayer(pastPlayer.email);
    } catch (error) {
      console.log(failedUpdate, 'Player profile', error);
    }
  };

  return (
    <>
      <div className='grid-label'>Email:</div>
      <button className='grid-value text-button' onClick={handleDialogOpen}>
        {pastPlayer.email}
      </button>
      <FieldEntryDialog<string>
        title={title ? title : ''}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setValue={value => handleDialogClose(value)}
        confirmMe
      />
    </>
  );
};
