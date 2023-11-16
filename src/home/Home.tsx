import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Login } from '../login/Login';

export const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

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
        <h1>Welcome to the Pool League Management System!</h1>
        {/* Additional content or navigation options */}
      </div>
    );
  } else {
    return <Login />;
  }
};
