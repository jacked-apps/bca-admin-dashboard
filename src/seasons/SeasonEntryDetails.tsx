import { Holiday, Season } from '../assets/types';
import { readableDate } from '../assets/dateFunctions';
import './seasons.css';

type SeasonEntryDetailsProps = {
  seasonData: Season;
  bcaEvent: Holiday;
  apaEvent: Holiday;
};

export const SeasonEntryDetails: React.FC<SeasonEntryDetailsProps> = ({
  seasonData,
  bcaEvent,
  apaEvent,
}) => {
  return (
    <div className='form-container'>
      <div className='season-title'>New Season Details</div>
      <div className='form-group'>
        <div>Season Name: </div>
        <div className='form-input'>{seasonData.seasonName}</div>
      </div>

      <div className='form-group'>
        <div>Pool Hall: </div>
        <div className='form-input'>{seasonData.poolHall}</div>
      </div>

      <div className='form-group'>
        <div>Start date:</div>
        <div className='form-input'>{readableDate(seasonData.startDate)}</div>
      </div>
      <div className='form-group'>
        <div>End date:</div>
        <div className='form-input'> {readableDate(seasonData.endDate)}</div>
      </div>
      <div className='form-group'>
        <div>Night:</div>
        <div className='form-input'>{seasonData.night}</div>
      </div>
      <div className='form-group'>
        <div>Game:</div>
        <div className='form-input'>{seasonData.game}</div>
      </div>
      <div className='form-group'>
        <div>Holidays:</div>
        <div className='form-input'>{seasonData.holidays.length} possible</div>
      </div>
      <div className='form-group'>
        <div>BCA Start:</div>
        <div className='form-input'>{readableDate(bcaEvent.start)}</div>
      </div>
      <div className='form-group'>
        <div>BCA End:</div>
        <div className='form-input'>{readableDate(bcaEvent.end)}</div>
      </div>
      <div className='form-group'>
        <div>APA Start:</div>
        <div className='form-input'>{readableDate(apaEvent.start)}</div>
      </div>
      <div className='form-group'>
        <div>APA End</div>
        <div className='form-input'>{readableDate(apaEvent.end)}</div>
      </div>
    </div>
  );
};
