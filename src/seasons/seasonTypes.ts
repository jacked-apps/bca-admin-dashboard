import { Game, PoolHall } from '../assets/types';

export type FormValues = {
  poolHall: PoolHall;
  startDate: Date;
  game: Game;
  bcaStartDate: Date;
  bcaEndDate: Date;
  apaStartDate: Date;
  apaEndDate: Date;
};
