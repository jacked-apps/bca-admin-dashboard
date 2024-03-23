import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Login } from '../login/Login';
//import { ConfirmContext } from '../context/ConfirmContext';
//import { useContext } from 'react';
//import { useFetchSeasons } from '../firebase';
import { LogoutButton } from '../login/LogoutButton';
import { useAuthContext } from '../context/useAuthContext';
import { toast } from 'react-toastify';

export const Home = () => {
  const { isAdmin, currentUser } = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  //const [welcomeName, setUser] = useState<User | null>(null);
  //const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  //const { confirmMe } = useContext(ConfirmContext);

  //const { data: seasons } = useFetchSeasons();
  //console.log('HOME', isAdmin, currentUser);
  const welcomeName = currentUser?.firstName || currentUser?.email;
  const adminMessage = isAdmin
    ? 'Please navigate to "seasons" to create a new season'
    : 'If you wish to be a League Operator, please press the Apply button';
  const testConfirm = async () => {
    toast.info('Coming Soon');
    //TODO make an application form
  };
  console.log('HOME PAGE', currentUser, isAdmin);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  if (user) {
    return (
      <div>
        <h2>
          Welcome to the Pool League Management System{` ${welcomeName}`}!
        </h2>
        <h4>{adminMessage}</h4>
        {/* Additional content or navigation options */}
        <button onClick={testConfirm}>Apply</button>
        <LogoutButton />
      </div>
    );
  } else {
    return <Login />;
  }
};
