import { useState, useEffect } from 'react';
import { PastPlayer, Season } from './types';
import { fetchCurrentSeasons, fetchAllPastPlayers } from '../firebase/fetches';

export const useFetchSeasons = () => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const fetchedSeasons = await fetchCurrentSeasons();
        console.log('Fetched seasons:', fetchedSeasons);
        setSeasons(fetchedSeasons);
        if (fetchedSeasons.length === 1) {
          setSelectedSeason(fetchedSeasons[0]);
        }
      } catch (error) {
        console.error('Error retrieving current seasons', error);
      }
    };

    fetchSeasons();
  }, []);

  return { seasons, selectedSeason, setSelectedSeason };
};

export const useFetchPlayers = () => {
  const [pastPlayerData, setPastPlayerData] = useState<PastPlayer[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetch = await fetchAllPastPlayers();
        setPastPlayerData(fetch);
      } catch (error) {
        console.error('Error retrieving past player data', error);
      }
    };

    fetchPlayers();
  }, []);

  return { pastPlayerData };
};
