import { Home } from '../home/Home';
import { Seasons } from '../seasons/Seasons';
import { Teams } from '../teams/Teams';
import { Schedule } from '../schedule/Schedule';
import { MatchUps } from '../matchUps/MatchUps';

export const routes = [
  { name: 'Home', path: '/', Component: Home },
  { name: 'Seasons', path: '/seasons', Component: Seasons },
  { name: 'Teams', path: '/teams', Component: Teams },
  { name: 'Schedule', path: '/schedule', Component: Schedule },
  { name: 'Match Ups', path: '/MatchUps', Component: MatchUps },
];
