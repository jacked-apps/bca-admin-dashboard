import { useState, useEffect } from 'react';
import './teams.css';
import { PastPlayerSearch } from '../components/PastPlayerSearch';
import { convertPastPlayerToTeamPlayer } from '../assets/globalFunctions';
import { PastPlayer, Team, TeamPlayerRole } from '../assets/types';
import { playerOrder } from '../assets/globalVariables';
import { EditPlayer } from './EditPlayer';

type TeamDetailsProps = {
  team: Team;
  onSave: (editedTeam: Team) => void;
  onDelete: (teamToDelete: Team) => void;
  playerData: PastPlayer[];
};
export const TeamDetails = ({
  team,
  onSave,
  onDelete,
  playerData,
}: TeamDetailsProps) => {
  // set edited Team
  const [editedTeam, setEditedTeam] = useState<Team>(team);

  // useEffect
  useEffect(() => {
    setEditedTeam(team);
  }, [team]);

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
    <div className='details-container'>
      <div className='team-name-group'>
        <div className='details-title'>Team Name:</div>
        <input
          value={editedTeam.teamName}
          onChange={e =>
            setEditedTeam({ ...editedTeam, teamName: e.target.value })
          }
        />
      </div>

      <div>
        <div className='details-title'>Players:</div>
        {team &&
          playerOrder.map(role => {
            const playerInfo =
              editedTeam.players[role as keyof typeof team.players];
            return (
              <EditPlayer
                key={role}
                playerInfo={playerInfo}
                role={role}
                onSelect={handleSelect}
                playerData={playerData}
              />
            );
          })}
      </div>
      <div className='button-group'>
        <button onClick={() => onSave(editedTeam)}>Save</button>
        <button onClick={() => onDelete(team)}>Delete</button>
      </div>
    </div>
  );
};
