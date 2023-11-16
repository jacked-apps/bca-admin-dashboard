import React from 'react';
import styles from './teams.module.css';
import { useNavigate } from 'react-router-dom';

export const SeasonList = ({ seasons, selectedSeason, setSelectedSeason }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.seasonContainer}>
      <div className={styles.listText}>
        {selectedSeason ? 'Working Season:' : 'Choose Season'}
      </div>
      {selectedSeason ? (
        <>
          <div>{selectedSeason.seasonName}</div>
          <button onClick={() => setSelectedSeason(null)}>Change</button>
        </>
      ) : (
        <div className={styles.listContainer}>
          {seasons && seasons.length > 0 ? (
            seasons.map((season, index) => (
              <button
                className={styles.seasonButton}
                key={index}
                onClick={() => setSelectedSeason(season)}
              >
                {season.seasonName}
              </button>
            ))
          ) : (
            <button onClick={() => navigate('/seasons')}>
              Create New Season
            </button>
          )}
        </div>
      )}
    </div>
  );
};
