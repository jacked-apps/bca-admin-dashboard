import React from 'react';
import { CurrentUser, PastPlayer } from '../assets/types';
import './players.css';
type InfoProps = {
  pastPlayer: PastPlayer | null;
  currentUser: CurrentUser | null;
};
export const Info = ({ pastPlayer, currentUser }: InfoProps) => {
  const statKeys =
    pastPlayer && pastPlayer.stats ? Object.keys(pastPlayer.stats) : [];
  pastPlayer && console.log(statKeys);
  return (
    <div className='info-container'>
      <div className='title'>Information</div>

      {pastPlayer && (
        <div className='info-grid'>
          <div className='grid-label'>First:</div>
          <button className='grid-value text-button'>
            {pastPlayer.firstName}
          </button>
          <div className='grid-label'>Last:</div>
          <button className='grid-value text-button'>
            {pastPlayer.lastName}
          </button>
          <div className='grid-label'>Nickname:</div>
          <button className='grid-value text-button'>
            {pastPlayer.nickname}
          </button>
          <div className='grid-label'>Email:</div>
          <button className='grid-value text-button'>{pastPlayer.email}</button>
          <div className='grid-label'>Phone:</div>
          <button className='grid-value text-button'>{pastPlayer.phone}</button>
          <div className='grid-label'>Address:</div>
          <button className='grid-value text-button'>
            {pastPlayer.address}
          </button>
          <div className='grid-label'>City:</div>
          <div className='grid-value text-button'>
            {pastPlayer.city}, {pastPlayer.zip ? pastPlayer.zip : 'No Zip'}
          </div>
          <div className='grid-label'>Zip:</div>
          <div className='grid-value text-button'>
            {pastPlayer.zip ? pastPlayer.zip : 'No Zip'}
          </div>
          <div className='grid-label'>DOB:</div>
          <div className='grid-value text-button'>{pastPlayer.dob}</div>
        </div>
      )}
      {pastPlayer && pastPlayer.stats && (
        <div className='stats-container'>
          <div className='title'>Stats</div>
          <div className='info-grid'>
            {statKeys.map(key => {
              const stats = pastPlayer.stats
                ? pastPlayer.stats[key]
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
