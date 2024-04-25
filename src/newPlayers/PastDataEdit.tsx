// react
import React from 'react';
import { useAuthContext } from '../context/useAuthContext';
import { useCreatedEntityNavigation } from '../hooks/useCreatedEntityNavigation';

// form
import { FormValues, profileSchema, formFieldNames } from './profileSchema';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// firebase
import { LogoutButton } from '../login/LogoutButton';
import {
  useCreatePlayer,
  BarePlayer,
  PastPlayer,
  useAddGamesToPlayer,
} from 'bca-firebase-queries';
import {
  capitalizeField,
  formatPhoneNumber,
} from '../assets/formatEntryFunctions';

// components
import { toast } from 'react-toastify';
import { InfoButton } from '../components/InfoButton';

// functions
import { formatDateToYYYYMMDD } from '../assets/dateFunctions';
import { extractGamesFromPastPlayerSeason } from '../assets/gameFunctions';

type PastDataEditProps = {
  pastPlayer: PastPlayer;
};

export const PastDataEdit = ({ pastPlayer }: PastDataEditProps) => {
  // constants
  const { user } = useAuthContext();
  const { playerCreated } = useCreatedEntityNavigation();

  // firebase
  const {
    createPlayer,
    isLoading: isCreatingPlayer,
    isError: isCreationError,
  } = useCreatePlayer();
  const {
    addGamesToPlayer,
    isLoading: isAddingGames,
    isError: isGamesError,
  } = useAddGamesToPlayer();

  // form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      firstName: pastPlayer.firstName,
      lastName: pastPlayer.lastName,
      nickname: pastPlayer.nickname,
      phone: pastPlayer.phone,
      address: pastPlayer.address,
      city: pastPlayer.city,
      state: pastPlayer.state,
      zip: pastPlayer.zip,
    },
  });

  // handlers
  const onSubmit = async (data: FormValues) => {
    // create BarePlayer shape
    const playerData: BarePlayer = {
      address: capitalizeField(data.address),
      city: capitalizeField(data.city),
      state: capitalizeField(data.state),
      zip: data.zip,
      dob: formatDateToYYYYMMDD(pastPlayer.dob),
      email: pastPlayer.email,
      firstName: capitalizeField(data.firstName),
      lastName: capitalizeField(data.lastName),
      nickname: data.nickname,
      phone: formatPhoneNumber(data.phone),
    };

    //create player document
    if (user) {
      const onSuccess = async () => {
        toast.success('Player created successfully!');
      };
      await createPlayer(user.uid, playerData, onSuccess);

      // add games to player
      const seasonKeys = Object.keys(pastPlayer.stats);
      const gamePromises = seasonKeys.map((seasonKey) => {
        const games = extractGamesFromPastPlayerSeason(
          seasonKey,
          pastPlayer.stats[seasonKey]
        );
        if (games) {
          return addGamesToPlayer(user.uid, games);
        }
      });
      if (gamePromises.length > 0) {
        (await Promise.allSettled(gamePromises)).filter(Boolean);
      }
      // navigate on success
      if (isCreationError) {
        toast.error('Error creating player');
      } else if (isGamesError) {
        toast.error('Error adding games to player');
      } else {
        playerCreated();
      }
    }
  };

  return (
    <div className="confirm-container">
      <div className="confirm-title">Review Past Data</div>
      <div className="confirm-body">
        <form className="confirm-body-title" onSubmit={handleSubmit(onSubmit)}>
          Please update any old or incorrect information
          <div className="confirm-inputs-wrapper">
            {formFieldNames.map(({ name, label }) => (
              <React.Fragment key={name}>
                <div className="edit-input-container">
                  <div className="input-label">
                    {label}:
                    {name === 'nickname' && (
                      <InfoButton infoBlurbKey="nickname" />
                    )}
                  </div>
                  <input
                    id={name}
                    {...register(name as keyof FormValues)}
                    type="text"
                    className={
                      errors[name as keyof FormValues]
                        ? 'input-error'
                        : 'edit-input'
                    }
                  />
                </div>
                {errors[name as keyof FormValues] && (
                  <div className="error-message">
                    {errors[name as keyof FormValues]?.message}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="confirm-button-wrapper">
            <button type="submit" disabled={isCreatingPlayer || isAddingGames}>
              Submit
            </button>
            <LogoutButton disabled={isCreatingPlayer || isAddingGames} />
          </div>
        </form>
      </div>
    </div>
  );
};
