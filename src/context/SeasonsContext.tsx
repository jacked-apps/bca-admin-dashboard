import React, { createContext, useState, useEffect } from 'react';
import { Reads } from '../firebase/firebaseFunctions';
import { Season } from '../assets/types';
import { failedFetch, fromStore } from '../firebase/firebaseConsts';

export const SeasonsContext = createContext({
  seasons: [] as Season[],
  selectedSeason: null as Season | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedSeason: (_season: Season | null) => {},
  isLoading: false,
  error: null as Error | null,
  refetchSeasons: () => {},
});

export const SeasonsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(() => {
    const savedSeason = localStorage.getItem('selectedSeason');
    return savedSeason ? JSON.parse(savedSeason) : null;
  });

  useEffect(() => {
    localStorage.setItem('selectedSeason', JSON.stringify(selectedSeason));
  }, [selectedSeason]);

  const refetchSeasons = async () => {
    setIsLoading(true);
    try {
      const fetchedSeasons = await Reads.fetchCurrentSeasons();
      setSeasons(fetchedSeasons);
      if (fetchedSeasons.length === 1) {
        setSelectedSeason(fetchedSeasons[0]);
      }
    } catch (error) {
      console.error(failedFetch, 'Current Seasons', fromStore, error);
      setError(error instanceof Error ? error : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchSeasons();
  }, []);

  return (
    <SeasonsContext.Provider
      value={{
        seasons,
        selectedSeason,
        setSelectedSeason,
        isLoading,
        error,
        refetchSeasons,
      }}
    >
      {children}
    </SeasonsContext.Provider>
  );
};
