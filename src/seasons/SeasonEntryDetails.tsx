import './seasons.css';
type SeasonEntryDetailsProps = {
  seasonData: Season;
  bcaStartDate: Date | null;
  bcaEndDate: Date | null;
  apaStartDate: Date | null;
  apaEndDate: Date | null;
};
import { readableDate } from '../assets/dateFunctions';

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
      <div>Start date: {readableDate(seasonData.startDate)}</div>
      <div>End date: {readableDate(seasonData.endDate)}</div>
      <div>{seasonData.game}</div>
      <div>{seasonData.poolHall}</div>
    </div>
  );
};
