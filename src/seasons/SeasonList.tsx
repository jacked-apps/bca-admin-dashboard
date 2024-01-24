import { Season } from '../assets/types';
import './seasons.css';
import { useNavigate } from 'react-router-dom';
type SeasonListProps = {
  seasons: Season[];
  selectedSeason: Season | null;
  setSelectedSeason: (season: Season | null) => void;
};

export const SeasonList = ({
  seasons,
  selectedSeason,
  setSelectedSeason,
}: SeasonListProps) => {
  const navigate = useNavigate();
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
