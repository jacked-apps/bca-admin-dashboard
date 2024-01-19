import React, { useState } from 'react';
import { Email, PastPlayer } from '../assets/types';
import { Reads, Creates, Updates } from '../firebase/firebaseFunctions';
import { validatePastPlayerFields } from '../assets/validateFields';
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
      setChosenPastPlayer(newPlayer as PastPlayer);
      // delete the old document

      // await updatePlayer('email', newValue);
      // const updatedPlayer = await Reads.fetchPastPlayerData(pastPlayer.email); //refetch pastPlayer
      // if (updatedPlayer) {
      //   setChosenPastPlayer(updatedPlayer as PastPlayer);
      // }
    } catch (error) {
      console.log('Error updating pastPlayer', error);
    }
  };
  // const updateEmail = async (value: string) => {
  //   const userId = pastPlayer.currentUserId || null;
  //   try {
  //     Updates.updatePastPlayerProfile(pastPlayer.email, {
  //       email: value,
  //     });
  //     userId &&
  //       Updates.updateUserProfile(userId, {
  //         email: value,
  //       });
  //     alert(`Email updated successfully`);
  //   } catch (error) {
  //     console.log('Error updating Emails', error);
  //   }
  // };
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
