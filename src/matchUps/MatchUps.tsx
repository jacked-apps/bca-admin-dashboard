// hooks
import { useCallback, useContext, useEffect, useState } from 'react';

// components
import { SeasonList } from '../seasons/SeasonList';
import { TeamOrder } from './TeamOrder';
import { CreateMatches } from './CreateMatches';
import { FinishedMatches } from './FinishedMatches';
import { SetTeamsInSchedule } from './SetTeamsInSchedule';
import { ErrorAndRefetch } from '../components/ErrorAndRefetch';
// types
import {
  RoundRobinSchedule,
  RoundRobinScheduleFinished,
} from '../assets/typesFolder/matchupTypes';
import { Season } from '../assets/typesFolder/seasonTypes';
import { Team } from '../assets/typesFolder/teamTypes';

// firebase
import { useFetchSeasons } from '../firebase';
import { Reads } from '../assets/unused/firebaseFunctions';
// styles
import './matchups.css';
import { SelectedItemContext } from '../context/SelectedItemProvider';

export const MatchUps = () => {
  // state
  const { selectedSeason } = useContext(SelectedItemContext);
  const { isLoading, error, refetch: fetchSeasons } = useFetchSeasons();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamOrder, setTeamOrder] = useState<Team[]>(teams);
  const [schedule, setSchedule] = useState<RoundRobinSchedule | null>(null);
  const [finishedSchedule, setFinishedSchedule] =
    useState<RoundRobinScheduleFinished | null>(null);

  // effects
  const fetchTeams = useCallback(async (seasonSelected: Season) => {
    if (seasonSelected) {
      try {
        const fetchedTeams = await Reads.fetchTeamsFromSeason(
          seasonSelected.id,
        );
        setTeamOrder(fetchedTeams || []);
      } catch (error) {
        console.error('Error fetching teams from firebase', error);
      }
    } else {
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    const fetchFinishedSchedule = async () => {
      if (selectedSeason) {
        try {
          const fetchedFinishedSchedule =
            await Reads.fetchFinishedRoundRobinSchedule(selectedSeason.id);

          setFinishedSchedule(fetchedFinishedSchedule);

          console.log(fetchedFinishedSchedule);
        } catch (error) {
          console.error(
            `Error fetching finished round robin for ${selectedSeason.id}`,
          );
        }
      } else {
        setFinishedSchedule(null);
      }
    };
    fetchFinishedSchedule();
  }, [selectedSeason]);

  useEffect(() => {
    if (!selectedSeason) {
      setTeamOrder([]);
      return;
    }
    fetchTeams(selectedSeason);
  }, [selectedSeason, fetchTeams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error instanceof Error) {
    return <ErrorAndRefetch error={error} onRetry={fetchSeasons} />;
  }
  if (!selectedSeason) {
    return <div>No season selected</div>;
  }

  return (
    <div className='container'>
      <div className='match-lists'>
        <SeasonList />
        <TeamOrder teamOrder={teamOrder} setTeamOrder={setTeamOrder} />
        <SetTeamsInSchedule
          teamOrder={teamOrder}
          schedule={schedule}
          setFinishedSchedule={setFinishedSchedule}
          finishedSchedule={finishedSchedule}
          seasonId={selectedSeason ? selectedSeason.id : ''}
        />
      </div>
      <div className='match-working-area'>
        {finishedSchedule ? (
          <FinishedMatches
            finishedSchedule={finishedSchedule}
            selectedSeason={selectedSeason}
          />
        ) : (
          <CreateMatches
            numberOfTeams={teamOrder.length}
            schedule={schedule}
            setSchedule={setSchedule}
          />
        )}
      </div>
    </div>
  );
};
