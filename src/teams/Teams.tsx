import { useContext, useState } from 'react';

// context
import { SelectedSeasonContext } from '../context/SelectedSeasonProvider';

// components
import { TeamsList } from './TeamsList';
import { TeamDetails } from './TeamDetails';
import { AddTeamButton } from './AddTeamButton';
import { SeasonList } from '../seasons/SeasonList';
import { ErrorAndRefetch } from '../components/ErrorAndRefetch';

// firebase
import { useFetchTeamsFromSeason, fetchTeamByIdRQ } from '../firebase';
import {
  useAddNewTeamToSeason,
  useRemoveTeamFromSeason,
  useUpdateTeamData,
} from '../firebase/teamUpdateHooks';

// css
import './teams.css';

// types
import { TeamName } from '../assets/typesFolder/sharedTypes';
import { Team } from '../assets/typesFolder/teamTypes';

export const Teams = () => {
  // state
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const { selectedSeason } = useContext(SelectedSeasonContext);
  // database
  const {
    data: teams,
    isLoading,
    error,
    refetch: fetchTeams,
  } = useFetchTeamsFromSeason(selectedSeason?.seasonName);
  const { mutate: updateTeam } = useUpdateTeamData({ useToast: true });
  const { mutate: removeTeam } = useRemoveTeamFromSeason({ useToast: true });
  const { mutate: addNewTeam } = useAddNewTeamToSeason({ useToast: true });

  // Event handlers
  const handleSave = async (editedTeam: Team) => {
    if (!selectedTeam) {
      console.error('No team selected to save.');
      return;
    }
    if (!selectedSeason) {
      console.error('No season selected');
      return;
    }
    updateTeam({ teamId: editedTeam.id, data: editedTeam });
    setSelectedTeam(null);
    fetchTeams();
  };

  const handleDelete = async (teamToDelete: Team) => {
    if (!selectedSeason) {
      console.error('No team selected.');
      return;
    }
    removeTeam({ seasonName: selectedSeason.id, teamId: teamToDelete.id });
    fetchTeams();
  };

  const onCancel = () => {
    setSelectedTeam(null);
  };

  const handleAddTeam = async (teamName: TeamName) => {
    if (!selectedSeason) {
      console.error('No team selected to save.');
      return;
    }
    addNewTeam({ seasonName: selectedSeason.id, teamName });
    fetchTeams();
  };

  const handleTeamSelect = async (teamId: string | null) => {
    if (!teamId) {
      setSelectedTeam(null);
      return;
    }

    try {
      const upDatedTeamData = await fetchTeamByIdRQ(teamId);
      setSelectedTeam(upDatedTeamData);
    } catch (error) {
      console.error('Error fetching team data');
    }
  };

  // Loading and Error handling
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error instanceof Error)
    return <ErrorAndRefetch error={error} onRetry={fetchTeams} />;

  // Render
  return (
    <div className='container'>
      <div className='teams-lists'>
        <SeasonList />
        <TeamsList
          teams={teams || []}
          selectedTeam={selectedTeam}
          handleTeamSelect={handleTeamSelect}
        />
        {selectedSeason && <AddTeamButton onAddTeam={handleAddTeam} />}
      </div>
      <div className='teams-details'>
        {selectedTeam && (
          <TeamDetails
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
