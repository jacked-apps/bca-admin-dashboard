import { useState, useEffect } from 'react';
import { PastPlayer } from '../assets/types';
import { Fetches } from '../firebase/firebaseFunctions';

const useFetchPastPlayers = () => {
  const [pastPlayers, setPastPlayers] = useState<PastPlayer[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      try {
        const fetchedPastPlayers = await Fetches.fetchAllPastPlayers();
        setPastPlayers(fetchedPastPlayers);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching players from firebase', error);
        setError(
          error instanceof Error ? error : new Error('An error occurred'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  return { pastPlayers, isLoading, error };
};

export default useFetchPastPlayers;
