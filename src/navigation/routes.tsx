// public routes
import { Home } from '../home/Home';
import { Login } from '../login/Login';

// private routes
import { SignUp } from '../newPlayers/SignUp';

// admin routes
import { Seasons } from '../seasons/Seasons';
import { Teams } from '../teams/Teams';
import { Scheduler } from '../schedule/Scheduler';
import { MatchUps } from '../matchUps/MatchUps';
import { Players } from '../players/Players';

// protection

//types
import { ElementType } from 'react';
import Test from '../test/Test';

type Route = {
  name: string;
  path: string;
  protect?: boolean;
  Component: ElementType;
};
const protect = { protect: true };

export const publicRoutes: Route[] = [
  { name: 'Log In', path: '/login', Component: Login },
  { name: 'Test', path: '/test', Component: Test },
];

export const privateRoutes: Route[] = [
  { name: 'Home', path: '/', Component: Home },
  { name: 'Sign Up', path: '/signUp', Component: SignUp, ...protect },
];

export const adminRoutes: Route[] = [
  { name: 'Seasons', path: '/seasons', Component: Seasons, ...protect },
  { name: 'Teams', path: '/teams', Component: Teams, ...protect },
  { name: 'Schedule', path: '/schedule', Component: Scheduler, ...protect },
  { name: 'Match Ups', path: '/MatchUps', Component: MatchUps, ...protect },
  { name: 'Players', path: '/Players', Component: Players, ...protect },
];
