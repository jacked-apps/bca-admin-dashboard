import { Timestamp } from 'firebase/firestore';
export type SeasonName = string;
export type Email = string;
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
  game: string;
  holidays: Holiday[];
  night: DayOfWeek;
  poolHall: string;
  seasonCompleted: boolean;
  seasonName: SeasonName;
  teams: string[];
};

export type Holiday = {
  date: string;
  start: Timestamp;
  end: Timestamp;
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
