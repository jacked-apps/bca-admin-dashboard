import { Timestamp } from 'firebase/firestore';
import * from './sharedTypes'
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
