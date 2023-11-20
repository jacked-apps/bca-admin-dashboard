import { useState, useEffect, useCallback } from 'react';
// Components
import { TeamsList } from './TeamsList';
import { TeamDetails } from './TeamDetails';
import { NameMeButton } from './NameMeButton';
import { SeasonList } from '../seasons/SeasonList';
// Firebase and utility functions
import { Fetches, Posts, Updates } from '../firebase/firebaseFunctions';
import './teams.css';
import { useFetchPlayers, useFetchSeasons } from '../assets/customHooks';
import { Season, Team, TeamName } from '../assets/types';

export const Teams = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const { pastPlayerData } = useFetchPlayers();

  const fetchTeams = useCallback(async (seasonSelected: Season) => {
    if (seasonSelected) {
      try {
        const fetchedTeams = await Fetches.fetchTeamsFromSeason(
          seasonSelected.id,
        );
        console.log('Fetched teams;', fetchedTeams);
        setTeams(fetchedTeams || []);
      } catch (error) {
        console.error('Error fetching teams from firebase', error);
      }
    } else {
      setTeams([]);
    }
  }, []);

  useEffect(() => {
    if (!selectedSeason) {
      setTeams([]);
      return;
    }
    fetchTeams(selectedSeason);
  }, [selectedSeason, fetchTeams]);

  const handleSave = async (editedTeam: Team) => {
    if (!selectedTeam) {
      console.error('No team selected to save.');
      return;
    }
    try {
      await Updates.updateTeamData(editedTeam.id, editedTeam);
      const updatedTeams = teams.map(team =>
        team.id === selectedTeam.id ? editedTeam : team,
      );
      setTeams(updatedTeams);
      setSelectedTeam(null);
    } catch (error) {
      console.error(`Error updating team data: ${error}`, error);
    }
  };

  const handleDelete = async (teamToDelete: Team) => {
    if (!selectedSeason) {
      console.error('No team selected to save.');
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete ${teamToDelete.teamName}?`,
      )
    ) {
      try {
        await Updates.removeTeamFromSeason(
          selectedSeason.seasonName,
          teamToDelete.id,
        );
        setSelectedTeam(null);
        fetchTeams(selectedSeason);
      } catch (error) {
        console.error(`Error removing team: ${error}`, error);
      }
    }
  };

  const handleAddTeam = async (teamName: TeamName) => {
    if (!selectedSeason) {
      console.error('No team selected to save.');
      return;
    }
    try {
      await Posts.addNewTeamToSeason(selectedSeason.id, teamName);
      fetchTeams(selectedSeason);
    } catch (error) {
      console.error(`Error adding new team: ${error}`, error);
    }
  };

  return (
    <div className='container'>
      <div>
        <SeasonList
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
        <TeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
        />
        <NameMeButton onAdd={handleAddTeam} label='Add Team' />
      </div>
      <div>
        {selectedTeam && (
          <TeamDetails
            playerData={pastPlayerData}
            team={selectedTeam}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Teams;
