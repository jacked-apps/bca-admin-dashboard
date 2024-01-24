import { useState, useEffect } from 'react';
import { Reads } from '../firebase/firebaseFunctions';
import { Season } from '../assets/types';
import { failedFetch, fromStore } from '../firebase/firebaseConsts';

export const useFetchSeasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      setIsLoading(true);
      try {
        const fetchedSeasons = await Reads.fetchCurrentSeasons();
        setSeasons(fetchedSeasons);
        if (fetchedSeasons.length === 1) {
          setSelectedSeason(fetchedSeasons[0]);
        }
      } catch (error) {
        console.error(failedFetch, 'Current Seasons', fromStore, error);
        setError(
          error instanceof Error ? error : new Error('An error occurred'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  return { seasons, selectedSeason, setSelectedSeason, isLoading, error };
};
