import { useSeasons } from '../customHooks/useSeasons';
import './seasons.css';
import { useNavigate } from 'react-router-dom';

export const SeasonList = () => {
  const navigate = useNavigate();
  const { seasons, selectedSeason, setSelectedSeason } = useSeasons();
  return (
    <div className='list-container'>
      <div className='list-title'>
        {selectedSeason ? 'Working Season:' : 'Choose Season'}
      </div>
      {selectedSeason ? (
        <>
          <div className='list-name'>{selectedSeason.seasonName}</div>
          <button
            className='small-button'
            onClick={() => setSelectedSeason(null)}
          >
            Change
          </button>
        </>
      ) : (
        <div className='list-button-container'>
          {seasons && seasons.length > 0 ? (
            seasons.map((season, index) => (
              <button
                className='small-button'
                key={index}
                onClick={() => setSelectedSeason(season)}
              >
                {season.seasonName}
              </button>
            ))
          ) : (
            <button
              className='small-button'
              onClick={() => navigate('/seasons')}
            >
              Create New Season
            </button>
          )}
        </div>
      )}
    </div>
  );
};
