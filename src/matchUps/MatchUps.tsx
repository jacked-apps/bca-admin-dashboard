// hooks
import { useCallback, useEffect, useState } from 'react';
import { useFetchSeasons } from '../assets/customHooks';
// components
import { SeasonList } from '../seasons/SeasonList';
import { TeamOrder } from './TeamOrder';
// types
import { Season, Team } from '../assets/types';
// firebase
import { Fetches } from '../firebase/firebaseFunctions';
// styles
import './matchups.css';
import { CreateMatches } from './CreateMatches';

export const MatchUps = () => {
  // state
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamOrder, setTeamOrder] = useState<Team[]>(teams);

  // effects
  const fetchTeams = useCallback(async (seasonSelected: Season) => {
    if (seasonSelected) {
      try {
        const fetchedTeams = await Fetches.fetchTeamsFromSeason(
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
      </div>
      <div className='match-working-area'>
        <CreateMatches numberOfTeams={teamOrder.length} />
      </div>
    </div>
  );
};
