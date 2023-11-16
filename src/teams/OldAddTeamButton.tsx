import React from 'react';
import styles from './teams.module.css';

export const AddTeamButton = ({ onAdd }) => {
  const handleAdd = () => {
    const name = prompt('Enter team name');
    if (name) {
      onAdd({ name, members: [] });
    }
  };
  return (
    <div className={styles.addButtonView}>
      <button className={styles.addButton} onClick={handleAdd}>
        Add Team
      </button>
    </div>
  );
};
import React from 'react';
import styles from './teams.module.css';

export const AddTeamButton = ({ onAdd }) => {
  const handleAdd = () => {
    const name = prompt('Enter team name');
    if (name) {
      onAdd({ name, members: [] });
    }
  };
  return (
    <div className={styles.addButtonView}>
      <button className={styles.addButton} onClick={handleAdd}>
        Add Team
      </button>
    </div>
  );
};
