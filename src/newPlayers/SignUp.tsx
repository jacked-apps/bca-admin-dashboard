import { useFetchPastPlayerById } from 'bca-firebase-queries';
import { LoadingScreen } from '../components/LoadingScreen';

import { useAuth } from '../hooks/useAuth';
import './newPlayers.css';
import { useAuthContext } from '../context/useAuthContext';
type SignUpProps = {
  prop?: string;
};

export const SignUp = ({ prop = 'hello' }: SignUpProps) => {
  const { user } = useAuthContext();
  console.log('SignUp', user?.email);
  //console.log('SignUp', user);
  //useFetchPastPlayerById(user?.uid);

  // if (isLoading) {
  //   return <LoadingScreen />;
  // }

  //console.log('SignUp', data, isError);
  return <div className="container">Sign Up</div>;
};
