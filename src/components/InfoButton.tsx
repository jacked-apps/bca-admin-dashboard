import { FaQuestionCircle } from 'react-icons/fa';
import { infoBlurbs } from '../assets/infoBlurbs';
import { useState } from 'react';

type InfoButtonProps = {
  infoBlurbKey?: keyof typeof infoBlurbs;
};

export const InfoButton = ({ infoBlurbKey = 'sample' }: InfoButtonProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const blurb = infoBlurbs[infoBlurbKey];
  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);
  return (
    <div>
      <FaQuestionCircle onClick={openDialog} />
      <dialog
        style={{
          border: '3px solid blue',
          color: 'lightblue',
          marginTop: '25px',
        }}
        open={showDialog}
        onClick={closeDialog}
      >
        {showDialog &&
          blurb.map((blurb, index) => (
            <div style={{ minHeight: '15px' }} key={index}>
              {blurb}
            </div>
          ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'end',
            marginTop: '25px',
          }}
        >
          Click inside box to close
        </div>
      </dialog>
    </div>
  );
};
