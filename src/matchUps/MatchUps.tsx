// hooks
import { useCallback, useEffect, useState } from 'react';
import { useFetchSeasons } from '../assets/customHooks';
// components
import { SeasonList } from '../seasons/SeasonList';
import { TeamOrder } from './TeamOrder';
// types
import {
  RoundRobinSchedule,
  RoundRobinScheduleFinished,
  Season,
  Team,
} from '../assets/types';
// firebase
import { Reads } from '../firebase/firebaseFunctions';
// styles
import './matchups.css';
import { CreateMatches } from './CreateMatches';
import { SetTeamsInSchedule } from './SetTeamsInSchedule';
import { FinishedMatches } from './FinishedMatches';

export const MatchUps = () => {
  // state
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
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

  // more logic

  return (
    <div className='container'>
      <div className='match-lists'>
        <SeasonList
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
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
