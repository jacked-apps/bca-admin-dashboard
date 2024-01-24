import { useState } from 'react';
import { PastPlayerSearch } from '../components/PastPlayerSearch';
import { TeamPlayer, TeamPlayerRole, PastPlayer } from '../assets/types';
import { useFetchPastPlayers } from '../customHooks/useFetchPastPlayers';

type EditPlayerProps = {
  role: TeamPlayerRole;
  playerInfo: TeamPlayer;
  onSelect: (player: PastPlayer, role: TeamPlayerRole) => void;
  //playerData: PastPlayer[];
};

export const EditPlayer: React.FC<EditPlayerProps> = ({
  playerInfo,
  role,
  onSelect,
  //playerData,
}) => {
  const { pastPlayers, isLoading, error } = useFetchPastPlayers();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleEditClick = () => {
    setIsEditing(true);
  };
  const handleCancelClick = () => {
    setIsEditing(false);
  };
  if (isEditing || playerInfo.firstName === '') {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: '15px' }}>{role}:</div>
        <PastPlayerSearch
          list={pastPlayers}
          onSelect={player => {
            onSelect(player, role);
            setIsEditing(false);
          }}
        />

        {playerInfo.firstName !== '' && (
          <button className='small-button' onClick={handleCancelClick}>
            Cancel
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {role}: {playerInfo.firstName} {playerInfo.lastName}
      <button className='small-button' onClick={handleEditClick}>
        Edit
      </button>
    </div>
  );
};
