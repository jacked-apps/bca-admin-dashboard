import { Team } from '../assets/types';
import './teams.css';

type TeamsListProps = {
  teams: Team[];
  selectedTeam: Team | null;
  setSelectedTeam: (team: Team | null) => void;
};

export const TeamsList = ({
  teams,
  selectedTeam,
  setSelectedTeam,
}: TeamsListProps) => {
  return (
    <div className='list-container'>
      <div className='list-title'>
        {selectedTeam ? 'Working Team:' : 'Choose Team'}
      </div>
      {selectedTeam ? (
        <>
          <div className='list-name'>{selectedTeam.teamName}</div>
          <button
            className='small-button'
            onClick={() => setSelectedTeam(null)}
          >
            Change
          </button>
        </>
      ) : (
        <div className='list-button-container'>
          {teams && teams.length > 0 ? (
            teams.map((team, index) => (
              <button
                className='small-button'
                key={index}
                onClick={() => setSelectedTeam(team)}
              >
                {team.teamName}
              </button>
            ))
          ) : (
            <div>No teams available</div>
          )}
        </div>
      )}
      {teams && teams.length > 0 && <div>Team count: {teams.length}</div>}
    </div>
  );
};
