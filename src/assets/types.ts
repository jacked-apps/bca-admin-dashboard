import { Timestamp } from 'firebase/firestore';
export type SeasonName = string;
export type TimeOfYear = 'Spring' | 'Summer' | 'Fall' | 'Winter';
export type Email = string;
export type PoolHall = "Butera's Billiards" | 'Billiard Plaza';
export type Game = '8 Ball' | '9 Ball' | '10 Ball';
export type DateFormat = 'long' | 'short' | 'numeric';
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export type Names = {
  firstName: string;
  lastName: string;
  nickName: string;
};

export type Season = {
  id: SeasonName;
  startDate: Timestamp;
  endDate: Timestamp;
  game: Game;
  holidays: Holiday[];
  night: DayOfWeek;
  poolHall: PoolHall;
  seasonCompleted: boolean;
  seasonName: SeasonName;
  teams: string[];
};

export type Holiday = {
  date: string;
  start: Timestamp | Date;
  end: Timestamp | Date;
  rule: string;
  type: string;
};

export type Team = {
  teamId: string;
  seasonId: SeasonName;
  players: {
    captain: TeamPlayerInfo;
    player2: TeamPlayerInfo;
    player3: TeamPlayerInfo;
    player4: TeamPlayerInfo;
    player5: TeamPlayerInfo;
  };
};
export type TeamPlayer = {
  [role in TeamPlayerRole]: TeamPlayerInfo;
};
export type TeamPlayerRole =
  | 'captain'
  | 'player2'
  | 'player3'
  | 'player4'
  | 'player5';

export type TeamPlayerInfo = Names & {
  totalWins: number;
  totalLosses: number;
  pastPlayerId: Email;
  currentUserId: string;
};
export type PastPlayer = Names & {
  dob: string;
  email: Email;
  id: Email;
  phone: string;
  seasonOneWins?: string;
  seasonTwoWins?: string;
  seasonThreeWins?: string;
  seasonOneLosses?: string;
  seasonTwoLosses?: string;
  seasonThreeLosses?: string;
  zip: string;
};

//export type Schedule = {}
