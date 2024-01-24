import { useState, useEffect } from 'react';
import './teams.css';
import { convertPastPlayerToTeamPlayer } from '../assets/globalFunctions';
import { PastPlayer, Team, TeamPlayer, TeamPlayerRole } from '../assets/types';
import { playerOrder } from '../assets/globalVariables';
import { EditPlayer } from './EditPlayer';
import { Updates } from '../firebase/firebaseFunctions';

type TeamDetailsProps = {
  team: Team;
  onSave: (editedTeam: Team) => void;
  onDelete: (teamToDelete: Team) => void;
  onCancel: () => void;
};

export const TeamDetails = ({
  team,
  onSave,
  onDelete,
  onCancel,
}: TeamDetailsProps) => {
  // set edited Team
  const [editedTeam, setEditedTeam] = useState<Team>(team);

  // useEffect
  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

  const handleRemovePlayer = async (
    role: TeamPlayerRole,
    playerInfo: TeamPlayer,
  ) => {
    const teamId = team.id;
    try {
      await Updates.removePlayerFromTeam(teamId, role, playerInfo);
      // Remove player from local state to trigger a rerender
      setEditedTeam(prevTeam => {
        const updatedPlayers = { ...prevTeam.players };
        updatedPlayers[role] = {
          currentUserId: '',
          email: '',
          firstName: '',
          lastName: '',
          nickname: '',
          pastPlayerId: '',
          totalWins: 0,
          totalLosses: 0,
        };
        return { ...prevTeam, players: updatedPlayers };
      });
    } catch (error) {
      console.error('Error while removing player', error);
    }
    //console.log('Remove Player clicked', role, team, playerInfo);
  };

  const handleSelect = (player: PastPlayer, role: TeamPlayerRole) => {
    const newPlayerData = convertPastPlayerToTeamPlayer(player);
    setEditedTeam(prevTeam => ({
      ...prevTeam,
      players: {
        ...prevTeam.players,
        [role]: newPlayerData,
      },
    }));
  };

  return (
    <div className='d2-container'>
      <div className='details-name-group'>
        <div className='details-title'>Team Name:</div>
        <input
          value={editedTeam.teamName}
          onChange={e =>
            setEditedTeam({ ...editedTeam, teamName: e.target.value })
          }
        />
      </div>
      <div className='details-player-group'>
        <div className='details-title'>Players:</div>
        {team &&
          playerOrder.map(role => {
            const playerInfo =
              editedTeam.players[role as keyof typeof team.players];

            return (
              <div style={{ display: 'flex' }}>
                <EditPlayer
                  key={role}
                  playerInfo={playerInfo}
                  role={role}
                  onSelect={handleSelect}
                />
                <button
                  className='small-button'
                  onClick={() => handleRemovePlayer(role, playerInfo)}
                >
                  Remove
                </button>
              </div>
            );
          })}
      </div>
      <div className='details-button-group'>
        {' '}
        <button onClick={() => onSave(editedTeam)}>Save</button>
        <button onClick={() => onDelete(team)}>Delete</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};
