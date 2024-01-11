import { useEffect, useState } from 'react';
import { PastPlayersList } from './PastPlayersList';
import { Fetches } from '../firebase/firebaseFunctions';
import { CurrentUser, PastPlayer } from '../assets/types';
import { Info } from './Info';
import { CurrentPlayersList } from './CurrentPlayersList';

export const Players = () => {
  const [pastPlayers, setPastPlayers] = useState<PastPlayer[]>([]);
  const [chosenPastPlayer, setChosenPastPlayer] = useState<PastPlayer | null>(
    null,
  );
  const [currentUsers, setCurrentUsers] = useState<CurrentUser[]>([]);
  const [chosenCurrentUser, setChosenCurrentUser] =
    useState<CurrentUser | null>(null);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetchedPastPlayers = await Fetches.fetchAllPastPlayers();
        setPastPlayers(fetchedPastPlayers);
        const fetchedCurrentUsers = await Fetches.fetchAllCurrentUsers();
        setCurrentUsers(fetchedCurrentUsers);
      } catch (error) {
        console.error('Error fetching players from firebase', error);
      }
    };

    fetchPlayers();
  }, []);
  return (
    <div className='player-container'>
      <PastPlayersList
        setChosenPastPlayer={setChosenPastPlayer}
        pastPlayers={pastPlayers}
      />
      <Info pastPlayer={chosenPastPlayer} currentUser={chosenCurrentUser} />
      <CurrentPlayersList
        setChosenCurrentUser={setChosenCurrentUser}
        currentUsers={currentUsers}
      />
    </div>
  );
};
