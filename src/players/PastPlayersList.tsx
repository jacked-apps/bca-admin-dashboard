import { useEffect, useState } from 'react';
import { PastPlayer } from '../assets/types';
import { FaSearch } from 'react-icons/fa';
import './players.css';

type PastPlayersListProps = {
  pastPlayers: PastPlayer[];
  setChosenPastPlayer: (player: PastPlayer | null) => void;
};
export const PastPlayersList = ({
  pastPlayers,
  setChosenPastPlayer,
}: PastPlayersListProps) => {
  const [filteredPlayers, setFilteredPlayers] =
    useState<PastPlayer[]>(pastPlayers);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setFilteredPlayers(pastPlayers);
  }, [pastPlayers]);

  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = pastPlayers.filter(player =>
      `${player.firstName} ${player.lastName}`
        .toLowerCase()
        .includes(lowerCaseSearchTerm),
    );
    setFilteredPlayers(filtered);
  }, [pastPlayers, searchTerm]);

  const handleChoose = (player: PastPlayer) => {
    setChosenPastPlayer(player);
  };

  const handleSort = (sortBy: 'firstName' | 'lastName') => {
    const sortedPlayers = [...filteredPlayers];
    sortedPlayers.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) {
        return -1;
      }
      if (a[sortBy] > b[sortBy]) {
        return 1;
      }
      return 0;
    });
    setFilteredPlayers(sortedPlayers);
  };

  return (
    <div className='past-players-container'>
      <div className='title'>Past Players</div>
      <div className='buttons'>
        <button onClick={() => handleSort('firstName')}>First</button>
        <button onClick={() => handleSort('lastName')}>Last</button>
      </div>
      <div className='search-bar'>
        <FaSearch className='search-icon' size={24} />
        <input
          type='text'
          className='search-bar-input'
          placeholder='Search Players'
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <div className='list'>
        {filteredPlayers.map(player => (
          <button
            className='text-button'
            key={player.id}
            onClick={() => handleChoose(player)}
          >
            {player.firstName} {player.lastName}
          </button>
        ))}
      </div>
    </div>
  );
};
