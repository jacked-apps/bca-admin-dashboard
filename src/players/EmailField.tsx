import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { PastPlayer } from '../assets/types';
import { Reads, Creates, Deletes } from '../firebase/firebaseFunctions';
import { FieldEntryDialog } from '../components/FieldEntryDialog';

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

    try {
      // save pastPlayer data in a new variable called updatedPlayer
      const updatedPlayer = pastPlayer;

      // change the email in updatedPlayer to the newValue
      updatedPlayer.email = value;
      updatedPlayer.id = value;

      // create a new document in pastPlayers with the newValue as the id and the data from updatedPlayer
      await Creates.createPastPlayer(updatedPlayer);

      // fetch the newPlayer and set it to the chosenPastPlayer
      const newPlayer = await Reads.fetchPastPlayerData(updatedPlayer.email);
      if (!newPlayer) {
        toast.error('Error updating pastPlayer');
        return;
      }
      setChosenPastPlayer(newPlayer as PastPlayer);
      // delete the old document
      await Deletes.deletePastPlayer(pastPlayer.email);
      toast.success(`Email updated successfully`);
    } catch (error) {
      console.log('Error updating pastPlayer', error);
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
