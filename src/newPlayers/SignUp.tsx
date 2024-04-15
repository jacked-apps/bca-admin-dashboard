import { Email, useFetchPastPlayerById } from 'bca-firebase-queries';
import { LoadingScreen } from '../components/LoadingScreen';
import { useAuthContext } from '../context/useAuthContext';

import './newPlayers.css';
import { PastPlayer } from './PastPlayer';

export const SignUp = () => {
  const { user } = useAuthContext();
  const {
    data: pastPlayer,
    isLoading: isLoadingPastPlayer,
    isError: isPastPlayerError,
  } = useFetchPastPlayerById(user?.email as Email);

  if (isLoadingPastPlayer) {
    return <LoadingScreen />;
  }

  //console.log('SignUp', data, isError);
  return (
    <div className="sign-container">
      <div className="sign-title">Sign Up</div>
      {isPastPlayerError && (
        <p>There was an error signing you up. Please try again later.</p>
      )}
      {pastPlayer && <PastPlayer pastPlayer={pastPlayer} />}
    </div>
  );
};
