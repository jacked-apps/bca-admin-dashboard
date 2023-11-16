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
  // Render the data in your desired format
  return <div className='details-container'>{seasonData.poolHall}</div>;
};
