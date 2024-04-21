// react
import React from 'react';
import { useAuthContext } from '../context/useAuthContext';

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
  const { user, refetchPlayer, isLoading: isLoadingRefetch } = useAuthContext();
  const {
    createPlayer,
    isLoading: isCreatingPlayer,
    isError: isCreatePlayerError,
    error: createPlayerError,
  } = useCreatePlayer();
  const {
    addGamesToPlayer,
    isLoading: isAddingGames,
    isError: isAddGameError,
    error: addGameError,
  } = useAddGamesToPlayer();

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

  const addASetOfGames = async () => {
    const statKeys = Object.keys(pastPlayer.stats);
    const games = extractGamesFromPastPlayerSeason(
      statKeys[1],
      pastPlayer.stats[statKeys[1]]
    );
    if (!user || !games) return;
    console.log('Adding games...', games);
    await addGamesToPlayer(user?.uid, games);
  };

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
        //refetchPlayer();
        //setCreatedPlayer(true);
      };
      await createPlayer(user.uid, playerData, onSuccess);
      await addASetOfGames();
      // const seasonKeys = Object.keys(pastPlayer.stats);
      // const gamePromises = seasonKeys.map((seasonKey) => {
      //   const games = extractGamesFromPastPlayerSeason(
      //     seasonKey,
      //     pastPlayer.stats[seasonKey]
      //   );
      //   if (games) {
      //     return addGamesToPlayer(user.uid, games);
      //   }
      // });
      // (await Promise.allSettled(gamePromises)).filter(Boolean);
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
            <button type="submit">Submit</button>
            <LogoutButton />
          </div>
        </form>
      </div>
    </div>
  );
};
