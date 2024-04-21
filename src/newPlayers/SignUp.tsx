import { Email, useFetchPastPlayerById } from 'bca-firebase-queries';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuthContext } from '../context/useAuthContext';

import './newPlayers.css';
import { PastPlayerPage } from './PastPlayerPage';
import { NewPlayerForm } from './NewPlayerForm';
import { RetryFindPast } from './RetryFindPast';

export const SignUp = () => {
  const { user } = useAuthContext();
  const {
    data: pastPlayer,
    isLoading: isLoadingPastPlayer,
    isError: isPastPlayerError,
    refetch: refetchPastPlayer,
  } = useFetchPastPlayerById(user?.email as Email);

  if (isLoadingPastPlayer) {
    return (
      <LoadingScreen message="No user data found! Searching for past data" />
    );
  }

  //console.log('SignUp', data, isError);
  return (
    <div className="sign-container">
      <div className="sign-title">Sign Up</div>

      {isPastPlayerError && (
        <>
          <RetryFindPast
            refetchPastPlayer={refetchPastPlayer}
            isError={isPastPlayerError}
          />
          <NewPlayerForm />
        </>
      )}
      {pastPlayer && <PastPlayerPage pastPlayer={pastPlayer} />}
    </div>
  );
};
