import { PoolHall, Game } from '../assets/typesFolder/sharedTypes';

export type FormValues = {
  poolHall: PoolHall;
  startDate: Date;
  game: Game;
  bcaStartDate: Date;
  bcaEndDate: Date;
  apaStartDate: Date;
  apaEndDate: Date;
};

export type FieldNames = keyof FormValues;
