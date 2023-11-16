import { useState, useEffect } from 'react';
import * as Fetches from './yourFetchesFile'; // replace 'yourFetchesFile' with the actual name of your fetches file

export const useFetchSeasons = () => {
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(null);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const fetch = await Fetches.fetchCurrentSeasons();
        setSeasons(fetch);
        if (fetch.length === 1) {
          setSelectedSeason(fetch[0]);
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
  const [pastPlayerData, setPastPlayerData] = useState([]);
  const [playerNames, setPlayerNames] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const fetch = await Fetches.fetchAllPastPlayers();
        setPastPlayerData(fetch);
        const namesList = [];
        fetch.forEach(player =>
          namesList.push(`${player.firstName} ${player.lastName}`),
        );
        setPlayerNames(namesList);
      } catch (error) {
        console.error('Error retrieving past player data', error);
      }
    };

    fetchPlayers();
  }, []);

  return { pastPlayerData, playerNames };
};
