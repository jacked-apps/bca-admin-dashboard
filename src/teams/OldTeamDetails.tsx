import React, { useEffect, useState } from 'react';
import styles from './teams.module.css';
import { DropdownSearch } from '../components/DropdownSearch';
import { convertToTeamPlayer } from '../functions/generalFunctions';
import { findDuplicates } from '../functions/generalFunctions';

export const TeamDetails = ({ team, onSave, onDelete, playerData }) => {
  const [editedTeam, setEditedTeam] = useState(team);

  // Define your player order here
  const playerOrder = ['captain', 'player2', 'player3', 'player4', 'player5'];

  const handleSelect = (player, position) => {
    const newPlayerData = convertToTeamPlayer(player);
    setEditedTeam(prevTeam => ({
      ...prevTeam,
      players: {
        ...prevTeam.players,
        [position]: newPlayerData,
      },
    }));
  };

  return (
    <div className={styles.detailsContainer}>
      {/* ... other code */}
      <div>
        <div className={styles.detailsTitle}>Players:</div>
        {playerOrder.map(key => (
          <div key={key}>
            <div className={styles.detailsLabel}>{key}</div>
            <DropdownSearch
              list={playerData}
              onSelect={player => handleSelect(player, key)}
              mapKey={['firstName', 'lastName']}
            />
          </div>
        ))}
      </div>
      {/* ... other code */}
    </div>
  );
};
