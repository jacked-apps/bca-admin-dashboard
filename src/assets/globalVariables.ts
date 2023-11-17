import { DayOfWeek, Game, PoolHall } from './types';

export const daysOfTheWeek: DayOfWeek[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const timestampWeek: number = 604800000;
export const poolHalls: PoolHall[] = ['Billiard Plaza', "Butera's Billiards"];
export const games: Game[] = ['9 Ball', '8 Ball', '10 Ball'];
export const bcaWebsite = 'https://www.playcsipool.com/events.html';
export const apaWebsite = 'https://poolplayers.com/world-pool-championships/';
export const blankPlayerObject = {
  captain: {
    firstName: '',
    lastName: '',
    nickname: '',
    pastPlayerId: '',
    currentUserId: '',
    totalWins: 0,
    totalLosses: 0,
  },

  player2: {
    firstName: '',
    lastName: '',
    nickname: '',
    pastPlayerId: '',
    currentUserId: '',
    totalWins: 0,
    totalLosses: 0,
  },

  player3: {
    firstName: '',
    lastName: '',
    nickname: '',
    pastPlayerId: '',
    currentUserId: '',
    totalWins: 0,
    totalLosses: 0,
  },

  player4: {
    firstName: '',
    lastName: '',
    nickname: '',
    pastPlayerId: '',
    currentUserId: '',
    totalWins: 0,
    totalLosses: 0,
  },

  player5: {
    firstName: '',
    lastName: '',
    nickname: '',
    pastPlayerId: '',
    currentUserId: '',
    totalWins: 0,
    totalLosses: 0,
  },
};
