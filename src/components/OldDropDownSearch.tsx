import React, { useEffect, useState } from 'react';
import styles from './teams.module.css';
import { DropdownSearch } from './OldDropDownSearch';
import { convertToTeamPlayer } from '../functions/generalFunctions';

export const TeamDetails = ({ team, onSave, onDelete, playerData }) => {
  const [editedTeam, setEditedTeam] = useState(team);

  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

  const handleSelect = (player, position) => {
    // make a copy
    const updatedPlayers = [...editedTeam.players];

    // find the index of the player object by position
    const index = updatedPlayers.findIndex(p => Object.keys(p)[0] === position);

    // convert the pastPlayer data to teamPlayer data
    const newPlayerData = convertToTeamPlayer(player);

    if (index !== -1) {
      // update the player object
      updatedPlayers[index] = {
        ...updatedPlayers[index],
        [position]: {
          ...newPlayerData,
        },
      };
    } else {
      alert(
        `Something went wrong.  ${position} is not one of the positions available`,
      );
    }

    setEditedTeam({
      ...editedTeam,
      players: updatedPlayers,
    });
  };

  return (
    <div className={styles.detailsContainer}>
      <div>
        <div className={styles.detailsTitle}>Team Name:</div>
        <input
          value={editedTeam.teamName}
          onChange={e => {
            const newTeamName = e.target.value;
            setEditedTeam({ ...editedTeam, teamName: newTeamName });
          }}
        />
      </div>
      <div>
        <div className={styles.detailsTitle}>Players:</div>
        {editedTeam.players.map(playerObject => {
          const [key] = Object.keys(playerObject);
          return (
            <div>
              <div className={styles.detailsLabel}>{key}</div>
              <DropdownSearch
                list={playerData}
                onSelect={player => handleSelect(player, key)}
                mapKey={['firstName', 'lastName']}
              />
            </div>
          );
        })}
      </div>

      <div>
        <button className={styles.addButton} onClick={() => onSave(editedTeam)}>
          Save
        </button>
        <button className={styles.addButton} onClick={() => onDelete(team)}>
          Delete
        </button>
      </div>
    </div>
  );
};
