// ------------------------------
// TABLE OF CONTENTS
// ------------------------------
// 1. Shared Types
// 2. Enum-like Types
// 3. Alias Types
// 4. Mapped Types
// 5. Firebase Document Object Types
// 6. Embedded Object Types
// 7. Utility Types

// ------------------------------
// 1. IMPORTS
// ------------------------------

import { Timestamp } from 'firebase/firestore';

// ------------------------------
// 1. SHARED TYPES
// ------------------------------

// Represents a basic name structure for individual players
// This is shared with several objects like pastPlayer, currentPlayer, and teams documents
export type Names = {
  firstName: string;
  lastName: string;
  nickname: string;
};
// ------------------------------
// 2. ENUM-LIKE TYPES
// ------------------------------

// Represents different types of pool games
export type Game = '8 Ball' | '9 Ball' | '10 Ball';

// Represents the 4 seasons of the year.   Named time of year as Seasons is a firebase object
export type TimeOfYear = 'Spring' | 'Summer' | 'Fall' | 'Winter';

// Names of available Pool Halls
export type PoolHall = "Butera's Billiards" | 'Billiard Plaza';

// Represents the Date format Used in this app.
//toLocaleString('en-US', { year: 'numeric', month: format, day: 'numeric', });
export type DateFormat = 'long' | 'short' | 'numeric';

// Represents the days of the week or the night of the week league is on.
export type DayOfWeek =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

// ------------------------------
// 3. FIREBASE ALIAS TYPES
// ------------------------------

// Represents a season's name and also is the season id.
export type SeasonName = string;

// Represents a teams's name.
export type TeamName = string;
// Represents an email address and also is the pastPlayers id
export type Email = string;

// Represents a team's id in the collection Teams
export type TeamId = string;

// Represents a players id in the collection currentPlayers
export type PlayerId = string;

// Represents a matchup id in the collection Matchups
export type MatchupId = string;

// ------------------------------
// 4. MAPPED TYPES
// ------------------------------

// ------------------------------
// 5. FIREBASE DOCUMENT OBJECT TYPES
// ------------------------------

// Represents a player (archive) in pastPlayers collection
// Names includes: firstName, lastName, nickName
export type PastPlayer = Names & {
  id: Email; // the Email of the player also the id of the document
  currentUserId?: PlayerId;
  email: Email; // Email of the player
  dob: string; // Date of birth of the player
  address: string; // The players Address
  city: string; // The city the player lives in
  zip: string; // That cities zip code
  phone: string; // The players phone number
  // archived wins and losses for the last 3 seasons if available
  stats?: {
    [string: SeasonName]: { wins: number; losses: number };
  };
  seasons?: string[];
  teams?: string[];
};

// Represents a player that has logged into the app with minimal information
// needed to run most of the seasons data.
export type CurrentUser = Names & {
  id: string;
  isAdmin?: boolean;
  email: Email;
  handicap9: number;
  handicap8: number;
  seasons: string[];
  teams: string[];
};

//Represents a Season document from seasons Collection
export type Season = {
  id: SeasonName; //  string; built by buildSeasonName()
  startDate: StampOrInvalid; // firebase Timestamp or "Invalid Date"
  endDate: StampOrInvalid; // firebase Timestamp or "Invalid Date"
  game: Game; //'8 Ball' | '9 Ball' | '10 Ball';
  holidays: Holiday[]; // Array of Holiday Objects from fetchHolidays() or createHolidayObject()
  night: DayOfWeek; // 'Sunday'| 'Monday'| 'Tuesday'| 'Wednesday'| 'Thursday'| 'Friday'| 'Saturday';
  poolHall: PoolHall; //"Butera's Billiards" | 'Billiard Plaza';
  seasonCompleted: boolean;
  seasonName: SeasonName; //  string; built by buildSeasonName()
  teams: TeamId[]; // string the ids for the Team in firebase collection Teams
  schedule: Schedule; // The schedule Object
};

// Represents a Matchup document from the matchups Collection
export type Matchup = {
  // Table on which the teams will be playing e.g. 'Table 1'
  [tableNumber: string]: {
    home: TeamInfo; // Object includes teamName, lineup(object with the 3 players information) =>
    away: TeamInfo; //  id, teamName, lineup, teamHandicap, gamesWon, winsNeeded, tiePossible
    winner: TeamId | null; // Team id (from teams collection) of the winning team
    gamePlay: GamePlay; // Gameplay includes the game number and the results of the game (breaker, racker, winner)
    seasonId: SeasonName; // Season name/id from seasons collection
    completed: boolean; // indicates if all games for this table/match have been played
  };

  // will need one table for every 2 teams in the season
  // maximum 14 teams to a season (at least as of now)
};

// ------------------------------
// 6. EMBEDDED OBJECT TYPES
// ------------------------------

// Embedded on Season
// Represents the Schedule for the season
// holds information on the dates of league play, holidays and off nights

export type Schedule = {
  // Each key will be a date string
  [dateKey: string]: {
    // Key will be a date string "short"
    title: string; // will be either the week 'Week 1', or the reason/title for the night off e.g. holiday, event, season break etc.
    leaguePlay: boolean; // boolean representing if the league plays or not
    matchUps: MatchupId; // matchup id from the matchups collection
  };

  // this will be at least 18 dates more is probable as holidays will interfere with gameplay
};

// Embedded on Season
// Represents a Holiday from date-holidays package
// Holds information on possible Holiday conflicts

export type Holiday = {
  date: string; // start date represented as a string
  name: string; // the name of the holiday
  start: DateOrStamp; // Date or Firebase Timestamp.  comes as Date object but firebase saves as Timestamp
  end: DateOrStamp; // Date or Firebase Timestamp.  comes as Date object but firebase saves as Timestamp
  rule: string; // The rule given for the holiday
  type: string; // The type of holiday religious event etc.
};

// Embedded on Team
// Represents a Holiday from date-holidays package
// Holds information on possible Holiday conflicts
// Names includes: firstName, lastName, nickName

// Embedded on Match
// Represents a Team in a match
// Holds information about the team

export type TeamInfo = {
  id: TeamId; // id from a Team in teams collection
  teamName: string; // The name of the team
  lineup: Lineup; // The three players playing that night and their information e.g "player1 " (names handicap wins losses etc)
  teamHandicap: number; // The added handicap for the team dependant on the TeamVictories.
  gamesWon: number; // The number of games the team has won in the match
  winsNeeded: number; // The number of games needed to get a TeamVictory on this match (from comparing the 2 teams handicaps)
  tiePossible: boolean; // Indicates if a tie is possible
};

// Embedded on TeamInfo
// Represents the three players playing in a match
// Holds information about the players and their position

export type Lineup = {
  player1: ActivePlayer; // has player information including
  player2: ActivePlayer; // id, handicap, wins losses
  player3: ActivePlayer;
};

// Embedded on Lineup
// Represents the information of three players playing in a match
// Holds information about the player

export type ActivePlayer = Names & {
  id: PlayerId; // the players id / email
  handicap: number; // The players handicap (derived from Total career (wins - losses)/ weeks played)
  wins: number; // Wins in this match
  losses: number; // Losses in this match
};

// Embedded on Matchup
// Represents all the games played in a match

export type GamePlay = {
  [gameKey: string]: GamePlayResults;
  // gameKey should be game1, game2 etc. to game18,
  // after game18  (if match is tied) gameKey should be tieBreakGame1, tieBreakGame2, tieBreakGame3
  // will need 18 to 21 games here to decide the match
};

// Embedded on GamePlay
// Represents a game (the 2 players and who won)

export type GamePlayResults = {
  breaker: PlayerId; //currentPlayer id
  racker: PlayerId; //currentPlayer id
  winner: PlayerId; //currentPlayer id
};

// ------------------------------
// 7. UTILITY TYPES
// ------------------------------

// Represents a date or a Firestore Timestamp
export type DateOrStamp = Timestamp | Date;

// Represents either a Firestore Timestamp or "Invalid Date"
export type StampOrInvalid = Timestamp | NotDate;

// A lot of Date functions work taking in a date of any kind.
// If a Date is invalid they will return "Invalid Date"
export type NotDate = 'Invalid Date';

//////////////////////////////////////
/// team related
// Represents a Team document from teams Collection
export type Team = {
  id: TeamId; // a string representing the Teams document id
  teamName: string;
  seasonId: SeasonName; // a string representing the Seasons document Id
  players: {
    captain: TeamPlayer;
    player2: TeamPlayer;
    player3: TeamPlayer;
    player4: TeamPlayer;
    player5: TeamPlayer;
  };
  wins: number; // The number of time a team has won a match. TeamVictories
  losses: number; // The number of times a Team has lost a match
  points: number; // The number of points (excess games) the team earned in a match
};

// Represents all of the players "roles" on a team in Teams collection
export type TeamPlayerRole =
  | 'captain'
  | 'player2'
  | 'player3'
  | 'player4'
  | 'player5';

export type TeamPlayer = {
  firstName: string;
  lastName: string;
  nickname: string;
  email: Email;
  totalWins: number; // career wins for the player (adds up wins from previous 3 seasons)
  totalLosses: number; // career losses for the player (adds up losses from previous 3 seasons)
  pastPlayerId: Email; // players id from pastPlayers collection (also the players Email)
  currentUserId: PlayerId; // players id from currentPlayer collection
};

// Represents a matchup at a table, with two teams playing against each other.
export type TableMatchup = { home: number; away: number }; // Tuple: [Team1, Team2]
export type TableMatchupFinished = {
  home: { ame: string; id: string };
  away: { teamName: string; id: string };
};

// Represents the entire round-robin schedule with weeks as keys and arrays of table matchups.
export type RoundRobinSchedule = {
  [week: string]: TableMatchup[];
};

export type RoundRobinScheduleFinished = {
  [week: string]: TableMatchupFinished[];
};
