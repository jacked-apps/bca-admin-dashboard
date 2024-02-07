import { createContext, useState, useEffect } from 'react';
import { Season } from '../assets/typesFolder/seasonTypes';

export const SelectedSeasonContext = createContext({
  selectedSeason: null as Season | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setSelectedSeason: (_season: Season | null) => {},
});

export const SelectedSeasonProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(() => {
    const savedSeason = localStorage.getItem('selectedSeason');
    return savedSeason ? JSON.parse(savedSeason) : null;
  });

  useEffect(() => {
    localStorage.setItem('selectedSeason', JSON.stringify(selectedSeason));
  }, [selectedSeason]);

  return (
    <SelectedSeasonContext.Provider
      value={{ selectedSeason, setSelectedSeason }}
    >
      {children}
    </SelectedSeasonContext.Provider>
  );
};
