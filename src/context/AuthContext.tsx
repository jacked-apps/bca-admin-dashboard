import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { CurrentUser } from '../assets/typesFolder/userTypes';
import { useAuth } from '../hooks/useAuth';
import { useFetchCurrentUserById } from '../hooks/playerFetchHooks';

type AuthContextType = {
  user: User | null;
  isAdmin: boolean;
  currentUser: CurrentUser | null | undefined;
  isLoggedIn: boolean;
};
type AuthProviderProps = {
  children: ReactNode;
};
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  currentUser: null,
  isLoggedIn: false,
});

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  const userId = (user && user.uid) || undefined;
  const { data: currentUser } = useFetchCurrentUserById(userId);

  useEffect(() => {
    setIsAdmin(currentUser?.isAdmin === 'true');
  }, [currentUser]);

  const value = {
    user,
    isAdmin,
    currentUser,
    isLoggedIn: !!user && user.emailVerified,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
