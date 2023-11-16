import React from 'react';
import styles from './teams.module.css';

export const TeamsList = ({ teams, selectedTeam, setSelectedTeam }) => {
  console.log('TEAMS LIST :', teams);

  return (
    <div className={styles.seasonContainer}>
      <div className={styles.listText}>
        {selectedTeam ? 'Working Team:' : 'Choose Team'}
      </div>
      {selectedTeam ? (
        <>
          <div>{selectedTeam.teamName}</div>
          <button onClick={() => setSelectedTeam(null)}>Change</button>
        </>
      ) : (
        <div className={styles.listContainer}>
          {teams && teams.length > 0 ? (
            teams.map((team, index) => (
              <button
                className={styles.seasonButton}
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
    </div>
  );
};
