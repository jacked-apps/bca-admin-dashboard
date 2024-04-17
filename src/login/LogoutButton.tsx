// react
import { useContext } from 'react';

// firebase
import { signOut } from 'firebase/auth';
import { FirebaseContext } from 'bca-firebase-queries';

// components
import { toast } from 'react-toastify';

type LogOutProps = {
  type?: 'small' | 'text' | 'default';
};

export const LogoutButton = ({ type = 'default' }: LogOutProps) => {
  const classString = type && type !== 'default' ? `${type}-button` : '';
  const { auth } = useContext(FirebaseContext);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      toast.info('User logged out');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <button className={classString} onClick={handleLogOut}>
      Log Out
    </button>
  );
};
