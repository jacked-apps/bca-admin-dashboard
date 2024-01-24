import { useState } from 'react';
import { PastPlayersList } from './PastPlayersList';
import { CurrentUser, PastPlayer } from '../assets/types';
import { useFetchCurrentUsers } from '../customHooks/useFetchCurrentUsers';
import { useFetchPastPlayers } from '../customHooks/useFetchPastPlayers';
import { Info } from './Info';
import { CurrentPlayersList } from './CurrentPlayersList';
import { failedFetch } from '../firebase/firebaseConsts';

export const Players = () => {
  const {
    pastPlayers,
    isLoading: isLoadingPastPlayers,
    error: errorPastPlayers,
  } = useFetchPastPlayers();
  const {
    currentUsers,
    isLoading: isLoadingCurrentUsers,
    error: errorCurrentUsers,
  } = useFetchCurrentUsers();

  const [chosenPastPlayer, setChosenPastPlayer] = useState<PastPlayer | null>(
    null,
  );
  const [chosenCurrentUser, setChosenCurrentUser] =
    useState<CurrentUser | null>(null);

  if (isLoadingPastPlayers || isLoadingCurrentUsers) {
    return <div>Loading...</div>;
  }
  if (errorPastPlayers) {
    return (
      <div>
        {failedFetch} Past Players: {errorPastPlayers.message}
      </div>
    );
  }
  if (errorCurrentUsers) {
    return (
      <div>
        {failedFetch} Current Users: {errorCurrentUsers.message}
      </div>
    );
  }
  return (
    <div className='player-container'>
      <PastPlayersList
        setChosenPastPlayer={setChosenPastPlayer}
        pastPlayers={pastPlayers}
      />
      <Info
        pastPlayer={chosenPastPlayer}
        currentUser={chosenCurrentUser}
        setChosenPastPlayer={setChosenPastPlayer}
      />
      <CurrentPlayersList
        setChosenCurrentUser={setChosenCurrentUser}
        currentUsers={currentUsers}
      />
    </div>
  );
};
