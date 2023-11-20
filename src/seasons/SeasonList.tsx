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
          <div>{selectedSeason.seasonName}</div>
          <button
            className='list-button'
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
                className='list-button'
                key={index}
                onClick={() => setSelectedSeason(season)}
              >
                {season.seasonName}
              </button>
            ))
          ) : (
            <button
              className='list-button'
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
