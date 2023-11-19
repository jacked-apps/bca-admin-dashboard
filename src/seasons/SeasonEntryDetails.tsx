import { Season } from '../assets/types';
import { readableDate } from '../assets/dateFunctions';
import './seasons.css';

type SeasonEntryDetailsProps = {
  seasonData: Season;
  bcaStartDate: Date | null;
  bcaEndDate: Date | null;
  apaStartDate: Date | null;
  apaEndDate: Date | null;
};

export const SeasonEntryDetails: React.FC<SeasonEntryDetailsProps> = ({
  seasonData,
  bcaStartDate,
  bcaEndDate,
  apaStartDate,
  apaEndDate,
}) => {
  console.log('seasonData', seasonData);
  return (
    <div className='details-container'>
      <div> {seasonData.seasonName}</div>
      <div>Pool Hall: {seasonData.poolHall}</div>
      <div>Start date: {readableDate(seasonData.startDate)}</div>
      <div>End date: {readableDate(seasonData.endDate)}</div>
      <div>Night: {seasonData.night}</div>
      <div>Game: {seasonData.game}</div>
      <div>Holidays: {seasonData.holidays.length}</div>
    </div>
  );
};
