import { useState, useEffect, useCallback } from 'react';
// Components
import { TeamsList } from './TeamsList';
import { TeamDetails } from './TeamDetails';
import { AddTeamButton } from './AddTeamButton';
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
      if (!selectedSeason) {
        console.error('No season selected');
        return;
      }
      await Updates.updateTeamData(editedTeam.id, editedTeam);
      const updatedTeams = teams.map(team =>
        team.id === selectedTeam.id ? editedTeam : team,
      );
      setTeams(updatedTeams);

      setSelectedTeam(null);
      fetchTeams(selectedSeason);
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

  const onCancel = () => {
    setSelectedTeam(null);
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
  const handleTeamSelect = async (teamId: string | null) => {
    if (!teamId) {
      setSelectedTeam(null);
      return;
    }
    try {
      const upDatedTeamData = await Fetches.fetchTeamById(teamId);
      setSelectedTeam(upDatedTeamData);
    } catch (error) {
      console.error('Error fetching team data');
    }
  };

  return (
    <div className='container'>
      <div className='teams-lists'>
        <SeasonList
          seasons={seasons}
          selectedSeason={selectedSeason}
          setSelectedSeason={setSelectedSeason}
        />
        <TeamsList
          teams={teams}
          selectedTeam={selectedTeam}
          handleTeamSelect={handleTeamSelect}
        />
        {selectedSeason && <AddTeamButton onAddTeam={handleAddTeam} />}
      </div>
      <div className='teams-details'>
        {selectedTeam && (
          <TeamDetails
            playerData={pastPlayerData}
            team={selectedTeam}
            onSave={handleSave}
            onCancel={onCancel}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default Teams;
