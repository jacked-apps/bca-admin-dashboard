import { useState, useEffect } from 'react';
import { CurrentUser } from '../assets/types';
import { Reads } from '../firebase/firebaseFunctions';
import { failedFetch, fromStore } from '../firebase/firebaseConsts';

export const useFetchCurrentUsers = () => {
  const [currentUsers, setCurrentUsers] = useState<CurrentUser[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const fetchedCurrentUsers = await Reads.fetchAllCurrentUsers();
        setCurrentUsers(fetchedCurrentUsers);
        setIsLoading(false);
      } catch (error) {
        console.error(failedFetch, 'Users', fromStore, error);
        setError(
          error instanceof Error ? error : new Error('An error occurred'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { currentUsers, isLoading, error };
};
