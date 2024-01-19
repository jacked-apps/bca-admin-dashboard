import React from 'react';
// types
import { CurrentUser, PastPlayer } from '../assets/types';
// components
import { NameFields } from './NameFields';
import { ProfileFields } from './ProfileFields';
// styles
import './players.css';

type InfoProps = {
  pastPlayer: PastPlayer | null;
  currentUser: CurrentUser | null;
  setChosenPastPlayer: React.Dispatch<React.SetStateAction<PastPlayer | null>>;
};
export const Info = ({
  pastPlayer,
  currentUser,
  setChosenPastPlayer,
}: InfoProps) => {
  const statKeys =
    pastPlayer && pastPlayer.stats ? Object.keys(pastPlayer.stats) : [];

  return (
    <div className='info-container'>
      <div className='title'>Information</div>

      {pastPlayer && (
        <div className='info-grid'>
          <NameFields
            pastPlayer={pastPlayer}
            setChosenPastPlayer={setChosenPastPlayer}
          />
          <div className='grid-label'>Email:</div>
          <div className='grid-value text-button'>{pastPlayer.email}</div>
          <ProfileFields
            pastPlayer={pastPlayer}
            setChosenPastPlayer={setChosenPastPlayer}
          />
        </div>
      )}

      {pastPlayer && pastPlayer.stats && (
        <div className='stats-container'>
          <div className='title'>Stats</div>
          <div className='info-grid'>
            {statKeys.map(key => {
              const stats = pastPlayer.stats
                ? pastPlayer.stats[key as keyof PastPlayer['stats']]
                : { wins: 0, losses: 0 };

              return (
                <React.Fragment key={key}>
                  <div className='grid-label'> {key}</div>
                  <div className='grid-label'>Wins:</div>
                  <div className='grid-value'>{stats.wins}</div>
                  <div className='grid-label'>Losses:</div>
                  <div className='grid-value'>{stats.losses}</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {currentUser && (
        <>
          <div>
            {currentUser.firstName} {currentUser.lastName}
          </div>
          <div>{currentUser.email}</div>
        </>
      )}
    </div>
  );
};
