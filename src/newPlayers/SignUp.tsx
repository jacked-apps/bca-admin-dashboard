import { LoadingScreen } from '../components/LoadingScreen';
import { useFetchPlayerById } from '../hooks/newHooks';
import { useAuth } from '../hooks/useAuth';
import './newPlayers.css';
type SignUpProps = {
  prop?: string;
};

export const SignUp = ({ prop = 'hello' }: SignUpProps) => {
  const { user } = useAuth();
  //console.log('SignUp', user);
  const { data, isError, isLoading } = useFetchPlayerById(user?.uid);

  if (isLoading) {
    return <LoadingScreen />;
  }

  console.log('SignUp', data, isError);
  return <div className="container">{<LoadingScreen />}</div>;
};
