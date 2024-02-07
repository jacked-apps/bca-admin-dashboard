import React, { useState } from 'react';
// utilities
import { toast } from 'react-toastify';
import { failedUpdate } from '../firebase/firebaseConsts';
import { validatePastPlayerFields } from '../assets/validateFields';

// components
import { FieldEntryDialog } from '../components/FieldEntryDialog';

// types
import { PastPlayer } from '../assets/typesFolder/userTypes';

// firebase
import { Reads, Creates, Deletes } from '../assets/unused/firebaseFunctions';

type StatsProps = {
  pastPlayer: PastPlayer;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};

export const Stats = ({ pastPlayer, setChosenPastPlayer }: StatsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string | null>(null);
  const stats = pastPlayer.stats;

  const dateKeys = Object.keys(stats)
    // sort by newest to oldest
    .sort((a, b) => {
      const dateA = new Date(a).getTime();
      const dateB = new Date(b).getTime();
      return dateB - dateA;
    })
    // get newest 3 dates
    .slice(0, 3);

  // sort seasons by key (dateString)

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

    try {
      // save pastPlayer data and old email
      const oldEmail = pastPlayer.id.toLowerCase();
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
      toast.success(message);

      const newPlayer = await Reads.fetchPastPlayerData(updatedPlayer.email);
      if (!newPlayer) {
        toast.error(`${failedUpdate} Player profile`);
        return;
      }

      setChosenPastPlayer(newPlayer as PastPlayer);
      // delete the old document
      await Deletes.deletePastPlayer(oldEmail);
    } catch (error) {
      console.log(failedUpdate, 'Player profile', error);
    }
  };

  return (
    <>
      {pastPlayer.stats &&
        dateKeys.map(date => (
          <React.Fragment key={date}>
            <div className='grid-label'>{stats[date].seasonName}</div>
            <div className='grid-label'>Wins:</div>
            <button
              className='grid-value text-button'
              onClick={handleDialogOpen}
            >
              {stats[date].wins}
            </button>
            <div className='grid-label'>Losses:</div>
            <button
              className='grid-value text-button'
              onClick={handleDialogOpen}
            >
              {stats[date].losses}
            </button>
          </React.Fragment>
        ))}

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
