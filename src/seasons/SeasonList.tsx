//import { useSeasons } from '../customHooks/useSeasons';
import { useContext } from 'react';
import { SelectedSeasonContext } from '../context/SelectedSeasonProvider';
import './seasons.css';
import { useNavigate } from 'react-router-dom';
import { useFetchSeasons } from '../firebase';
import { ErrorAndRefetch } from '../components/ErrorAndRefetch';

export const SeasonList = () => {
  const navigate = useNavigate();
  //const { seasons, selectedSeason, setSelectedSeason } = useSeasons();
  const { selectedSeason, setSelectedSeason } = useContext(
    SelectedSeasonContext,
  );
  const { data: seasons, isLoading, error, refetch } = useFetchSeasons();
  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error)
    return <ErrorAndRefetch error={error} onRetry={refetch} />;
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
