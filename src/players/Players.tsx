import { useState } from 'react';
// components
import { PastPlayersList } from './PastPlayersList';
import { CurrentPlayersList } from './CurrentPlayersList';
import { Info } from './Info';

// types
import { PastPlayer, CurrentUser } from '../assets/typesFolder/userTypes';

// firebase
import { failedFetch } from '../firebase/firebaseConsts';
import { useFetchPastPlayers } from '../firebase';
import { useFetchCurrentUsers } from '../firebase';

export const Players = () => {
  const {
    data: pastPlayers,
    isLoading: isLoadingPastPlayers,
    error: errorPastPlayers,
  } = useFetchPastPlayers();
  const {
    data: currentUsers,
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
        pastPlayers={pastPlayers || []}
      />
      <Info
        pastPlayer={chosenPastPlayer}
        currentUser={chosenCurrentUser}
        setChosenPastPlayer={setChosenPastPlayer}
      />
      <CurrentPlayersList
        setChosenCurrentUser={setChosenCurrentUser}
        currentUsers={currentUsers || []}
      />
    </div>
  );
};
