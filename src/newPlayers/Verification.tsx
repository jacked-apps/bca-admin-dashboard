import { PastPlayer } from 'bca-firebase-queries';
import { useState, useEffect } from 'react';

type VerificationProps = {
  setFindPast: React.Dispatch<React.SetStateAction<boolean>>;
  matches: PastPlayer[];
};

export const Verification = ({ setFindPast, matches }: VerificationProps) => {
  const [useCheck, setUseCheck] = useState('');

  useEffect(() => {
    const availableChecks = matches
      .map((player) => {
        if (player.dob) {
          return 'dob';
        } else if (player.phone) {
          return 'phone';
        }
        return undefined; // handle the case where neither is defined
      })
      .filter(Boolean); // Remove any undefined values

    const setCheck = () => {
      if (availableChecks.length === 0) {
        setUseCheck('none');
        return; // Return early to avoid further execution
      }
      let phoneCount = 0;
      let dobCount = 0;

      availableChecks.forEach((check) => {
        if (check === 'dob') dobCount++;
        if (check === 'phone') phoneCount++;
      });

      setUseCheck(dobCount >= phoneCount ? 'dob' : 'phone');
    };

    setCheck();
  }, [matches]);

  return (
    <div>
      <div>Verification</div>
      {useCheck === 'none' && (
        <div>
          We have a possible profile however no way to verify you. Please
          contact your League operator.
        </div>
      )}
      {useCheck === 'dob' && <div>By Date Of Birth</div>}
      {useCheck === 'phone' && <div>By Phone</div>}
    </div>
  );
};
