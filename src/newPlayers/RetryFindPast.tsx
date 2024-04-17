import { useEffect, useState } from 'react';
import { InfoButton } from '../components/InfoButton';

type RetryFindPastProps = {
  refetchPastPlayer: () => void;
  isError: boolean;
};

export const RetryFindPast = ({
  refetchPastPlayer,
  isError,
}: RetryFindPastProps) => {
  const [triedBefore, setTriedBefore] = useState(false);
  useEffect(() => {
    const storedTriedBefore = localStorage.getItem('triedBefore');
    if (storedTriedBefore === 'true') {
      setTriedBefore(true);
    }
  }, []);

  const handleClick = () => {
    localStorage.setItem('triedBefore', 'true');
    setTriedBefore(true);
    refetchPastPlayer();
  };

  const errorStyle = {
    display: 'flex',
    justifyContent: 'end',
  };

  return (
    <>
      <div
        style={{
          display: 'flex',
          width: '90%',
          gap: '10px',
          justifyContent: 'end',
        }}
      >
        <InfoButton infoBlurbKey={'pastPlayer'} />
        <button onClick={handleClick}>I have played before</button>
      </div>
      {triedBefore && isError && (
        <div
          style={{
            color: 'red',

            width: '90%',
          }}
        >
          <div style={errorStyle}>
            Cannot find any past date for your email.
          </div>
          <div style={errorStyle}>If you are sure you have played before,</div>
          <div style={errorStyle}>Please enter your information.</div>
          <div style={errorStyle}>Then contact your League operator.</div>
        </div>
      )}
    </>
  );
};
