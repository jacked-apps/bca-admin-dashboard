import { useState } from 'react';

// components
import { PastPlayerSearch } from '../components/PastPlayerSearch';

// types
import { TeamPlayerRole, TeamPlayer } from '../assets/typesFolder/teamTypes';
import { PastPlayer } from '../assets/typesFolder/userTypes';

// firebase
import { useFetchPastPlayers } from '../firebase';
//import { useFetchPastPlayers } from '../customHooks/useFetchPastPlayers';

type EditPlayerProps = {
  role: TeamPlayerRole;
  playerInfo: TeamPlayer;
  onSelect: (player: PastPlayer, role: TeamPlayerRole) => void;
};

export const EditPlayer: React.FC<EditPlayerProps> = ({
  playerInfo,
  role,
  onSelect,
  //playerData,
}) => {
  const { data: pastPlayers, isLoading, error } = useFetchPastPlayers();
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
          list={pastPlayers ? pastPlayers : []}
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
