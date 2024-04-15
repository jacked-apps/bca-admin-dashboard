import { InfoButton } from '../components/InfoButton';

type RetryFindPastProps = {
  refetchPastPlayer: () => void;
};

export const RetryFindPast = ({ refetchPastPlayer }: RetryFindPastProps) => {
  return (
    <div
      style={{
        display: 'flex',
        width: '90%',
        gap: '10px',
        justifyContent: 'end',
      }}
    >
      <InfoButton infoBlurbKey={'pastPlayer'} />
      <button onClick={refetchPastPlayer}>I have played before</button>
    </div>
  );
};
