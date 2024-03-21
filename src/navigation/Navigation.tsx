import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes';
import { useAuthContext } from '../context/useAuthContext';
import './navigation.css';

export const Navigation = () => {
  const { isAdmin } = useAuthContext();

  return (
    <Router>
      <nav>
        <ul>
          {publicRoutes.map((route, index) => (
            <li key={index}>
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))}
          {isAdmin &&
            privateRoutes.map((route, index) => (
              <li key={index}>
                <Link to={route.path}>{route.name}</Link>
              </li>
            ))}
        </ul>
      </nav>
      <Routes>
        {publicRoutes
          .concat(privateRoutes.concat(isAdmin ? publicRoutes : []))
          .map(({ path, Component }, index) => (
            <Route key={index} path={path} element={<Component />} />
          ))}
      </Routes>
    </Router>
  );
};
