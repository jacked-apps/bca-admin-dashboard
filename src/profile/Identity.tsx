import { useState } from 'react';
import { Modal } from '../components/Modal';
import { FaRegSave, FaRegEdit } from 'react-icons/fa';
import { IdentityModal } from './IdentityModal';

type IdentityProps = {
  firstName: string;
  lastName: string;
  dob: string;
};

export const Identity = ({ firstName, lastName, dob }: IdentityProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const onClose = () => {
    setModalOpen(false);
  };
  return (
    <>
      <div className="profile-edit-group">
        <div className="profile-edit-label">Identity</div>
        <FaRegEdit
          className="profile-edit-value"
          onClick={() => setModalOpen(true)}
        />
      </div>

      <div className="profile-edit-group">
        <div className="profile-edit-label">Name:</div>
        <div className="profile-edit-value">
          {firstName} {lastName}
        </div>
      </div>
      <div className="profile-edit-group">
        <div className="profile-edit-label">Date of birth:</div>
        <div className="profile-edit-value">{dob}</div>
      </div>
      <Modal isOpen={modalOpen} onClose={onClose}>
        <div className="modal-title">Identity</div>
        <div className="modal-body-container">
          <IdentityModal firstName={firstName} lastName={lastName} dob={dob} />
        </div>
      </Modal>
    </>
  );
};
