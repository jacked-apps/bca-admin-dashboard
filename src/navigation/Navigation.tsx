import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './navigation.css';
import { routes } from './routes';

export const Navigation = () => {
  return (
    <Router>
      <nav>
        <ul>
          {routes.map((route, index) => (
            <li key={index}>
              <Link to={route.path}>{route.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <Routes>
        {routes.map(({ path, Component }, index) => (
          <Route key={index} path={path} element={<Component />} />
        ))}
      </Routes>
    </Router>
  );
};
