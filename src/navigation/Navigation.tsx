import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { publicRoutes, privateRoutes, adminRoutes } from './routes';
import { useAuthContext } from '../context/useAuthContext';
import { ProtectedRoute } from './ProtectedRoute';

import './navigation.css';

export const Navigation = () => {
  const { isLoggedIn, isAdmin } = useAuthContext();
  const location = useLocation();
  const hideNavOnPaths = ['/signUp'];

  return (
    <>
      {!hideNavOnPaths.includes(location.pathname) && (
        <nav>
          <ul>
            {/* Private Routes for logged-in users */}
            {isLoggedIn &&
              privateRoutes.map((route, index) => (
                <li key={index}>
                  <Link to={route.path}>{route.name}</Link>
                </li>
              ))}
            {/* Admin Routes, additionally for administrators */}
            {isAdmin &&
              adminRoutes.map((route, index) => (
                <li key={index}>
                  <Link to={route.path}>{route.name}</Link>
                </li>
              ))}
          </ul>
        </nav>
      )}
      <Routes>
        {publicRoutes.map(({ name, path, Component }) => (
          <Route key={name} path={path} element={<Component />} />
        ))}
        {privateRoutes.map(({ name, path, Component }) => (
          <Route
            key={name}
            path={path}
            element={
              <ProtectedRoute>
                <Component />
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </>
  );
};
