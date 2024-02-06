import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Login } from '../login/Login';
import { ConfirmContext } from '../context/ConfirmContext';
import { useContext } from 'react';

export const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();
  const { confirmMe } = useContext(ConfirmContext);

  const testConfirm = async () => {
    const confirm = await confirmMe(
      'Wow this is pretty cool but is it cool when its longer,  how about even longer and longer than that',
    );
    const text = confirm ? 'confirmed' : 'rejected';
    console.log('confirm', text);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
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
        <h2>Welcome to the Pool League Management System!</h2>
        {/* Additional content or navigation options */}
        <button onClick={testConfirm}>test confirm</button>
      </div>
    );
  } else {
    return <Login />;
  }
};
