import React from 'react';
import { CurrentUser, Names, PastPlayer } from '../assets/types';
import { nameFields, pastPlayerFields } from './buttonFields';

import './players.css';
import EditNameButton from '../components/EditNamesButton';
import { NameFields } from './NameFields';
import { set } from 'firebase/database';

export type PastPlayerProfileFields = Omit<
  PastPlayer,
  | 'email'
  | 'stats'
  | 'teams'
  | 'seasons'
  | 'firstName'
  | 'lastName'
  | 'nickname'
  | 'currentUserId'
  | 'id'
>;

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
          {pastPlayerFields.map(field => {
            return (
              <React.Fragment key={field.fieldName}>
                <div className='grid-label'>{field.name}:</div>
              </React.Fragment>
            );
          })}
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
