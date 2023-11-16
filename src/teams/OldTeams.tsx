import React, { useState, useEffect, useCallback } from 'react';
// Components
import { TeamsList } from './TeamsList';
import { TeamDetails } from './TeamDetails';
import { NameMeButton } from './NameMeButton';
import { SeasonList } from './SeasonList';
// firebase
import { Fetches, Posts, Updates } from '../firebase/firebaseFunctions';
import styles from './teams.module.css';
import { useFetchPlayers, useFetchSeasons } from '../functions/customHooks';

export const Teams = () => {
  // states
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const { pastPlayerData, playerNames } = useFetchPlayers();

  const me = pastPlayerData
    ? pastPlayerData.filter(player => player.lastName === 'Poplet')
    : [];

  // FETCH FUNCTIONS needed outside useEffects

  const fetchTeams = useCallback(async seasonSelected => {
    if (seasonSelected) {
      try {
        const fetch = await Fetches.fetchTeamsFromSeason(seasonSelected.id);
        console.log('fetch', fetch);
        if (fetch) {
          setTeams([]);
          setTeams(fetch);
        } else {
          // clear teams array if no season is selected
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching teams from firebase');
      }
    }
  }, []);

  // USE EFFECTS

  useEffect(() => {
    fetchTeams(selectedSeason);
  }, [selectedSeason, fetchTeams]);

  // HANDLE FUNCTIONS

  const handleSave = async editedTeam => {
    try {
      // update the team data to firebase
      await Updates.updateTeamData(editedTeam.id, editedTeam);
      // let the user know that the update occurred
      alert(
        `The new data for ${editedTeam.teamName} has been saved to firebase`,
      );
      // update the teams state with the new data
      const updatedTeams = teams.map(team =>
        team === selectedTeam ? editedTeam : team,
      );
      setTeams(updatedTeams);
      // deselect the saved team so the teams list comes up
      setSelectedTeam(null);
    } catch (error) {
      console.error(`Error updating ${editedTeam.teamName} to firebase`, error);
    }
  };

  const handleDelete = async teamToDelete => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${teamToDelete.teamName}`,
    );
    if (!isConfirmed) return;
    try {
      await Updates.removeTeamFromSeason(
        selectedSeason.seasonName,
        teamToDelete.id,
      );
      setSelectedTeam(null);
      fetchTeams(selectedSeason);
    } catch (error) {
      console.error(
        `Error removing ${teamToDelete.teamName} from ${selectedSeason.seasonName}`,
        error,
      );
    }
  };

  const handleAddTeam = async team => {
    try {
      await Posts.addNewTeamToSeason(selectedSeason.id, team);
      fetchTeams(selectedSeason);
    } catch (error) {
      console.error(`Error adding ${team} to ${selectedSeason.name}`, error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <div>
          <SeasonList
            seasons={seasons}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
          />
        </div>
        <div>
          <TeamsList
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />

          <NameMeButton onAdd={team => handleAddTeam(team)} label='Add Team' />
        </div>
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
      <div>
        <h3>heres all of me</h3>
        <ul>
          {me.map(item => (
            <li key={item.id}>
              {item.firstName} {item.lastName} - {item.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
import React, { useState, useEffect, useCallback } from 'react';
// Components
import { TeamsList } from './TeamsList';
import { TeamDetails } from './TeamDetails';
import { NameMeButton } from './NameMeButton';
import { SeasonList } from './SeasonList';
// firebase
import { Fetches, Posts, Updates } from '../firebase/firebaseFunctions';
import styles from './teams.module.css';
import { useFetchPlayers, useFetchSeasons } from '../functions/customHooks';

export const Teams = () => {
  // states
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
  const { pastPlayerData, playerNames } = useFetchPlayers();

  const me = pastPlayerData
    ? pastPlayerData.filter(player => player.lastName === 'Poplet')
    : [];

  // FETCH FUNCTIONS needed outside useEffects

  const fetchTeams = useCallback(async seasonSelected => {
    if (seasonSelected) {
      try {
        const fetch = await Fetches.fetchTeamsFromSeason(seasonSelected.id);
        console.log('fetch', fetch);
        if (fetch) {
          setTeams([]);
          setTeams(fetch);
        } else {
          // clear teams array if no season is selected
          setTeams([]);
        }
      } catch (error) {
        console.error('Error fetching teams from firebase');
      }
    }
  }, []);

  // USE EFFECTS

  useEffect(() => {
    fetchTeams(selectedSeason);
  }, [selectedSeason, fetchTeams]);

  // HANDLE FUNCTIONS

  const handleSave = async editedTeam => {
    try {
      // update the team data to firebase
      await Updates.updateTeamData(editedTeam.id, editedTeam);
      // let the user know that the update occurred
      alert(
        `The new data for ${editedTeam.teamName} has been saved to firebase`,
      );
      // update the teams state with the new data
      const updatedTeams = teams.map(team =>
        team === selectedTeam ? editedTeam : team,
      );
      setTeams(updatedTeams);
      // deselect the saved team so the teams list comes up
      setSelectedTeam(null);
    } catch (error) {
      console.error(`Error updating ${editedTeam.teamName} to firebase`, error);
    }
  };

  const handleDelete = async teamToDelete => {
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${teamToDelete.teamName}`,
    );
    if (!isConfirmed) return;
    try {
      await Updates.removeTeamFromSeason(
        selectedSeason.seasonName,
        teamToDelete.id,
      );
      setSelectedTeam(null);
      fetchTeams(selectedSeason);
    } catch (error) {
      console.error(
        `Error removing ${teamToDelete.teamName} from ${selectedSeason.seasonName}`,
        error,
      );
    }
  };

  const handleAddTeam = async team => {
    try {
      await Posts.addNewTeamToSeason(selectedSeason.id, team);
      fetchTeams(selectedSeason);
    } catch (error) {
      console.error(`Error adding ${team} to ${selectedSeason.name}`, error);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <div>
          <SeasonList
            seasons={seasons}
            selectedSeason={selectedSeason}
            setSelectedSeason={setSelectedSeason}
          />
        </div>
        <div>
          <TeamsList
            teams={teams}
            selectedTeam={selectedTeam}
            setSelectedTeam={setSelectedTeam}
          />

          <NameMeButton onAdd={team => handleAddTeam(team)} label='Add Team' />
        </div>
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
      <div>
        <h3>heres all of me</h3>
        <ul>
          {me.map(item => (
            <li key={item.id}>
              {item.firstName} {item.lastName} - {item.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// import React, { useState, useEffect, useCallback } from 'react';
// // Components
// import { TeamsList } from './TeamsList';
// import { TeamDetails } from './TeamDetails';
// import { NameMeButton } from './NameMeButton';
// import { SeasonList } from './SeasonList';
// // Firebase and utility functions
// import { Fetches, Posts, Updates } from '../firebase/firebaseFunctions';
// import styles from './teams.module.css';
// import { useFetchPlayers, useFetchSeasons } from '../functions/customHooks';

// export const Teams = () => {
//   const [teams, setTeams] = useState([]);
//   const [selectedTeam, setSelectedTeam] = useState(null);
//   const { seasons, selectedSeason, setSelectedSeason } = useFetchSeasons();
//   const { pastPlayerData, playerNames } = useFetchPlayers();

//   const fetchTeams = useCallback(async seasonSelected => {
//     if (seasonSelected) {
//       try {
//         const fetchedTeams = await Fetches.fetchTeamsFromSeason(seasonSelected.id);
//         setTeams(fetchedTeams || []);
//       } catch (error) {
//         console.error('Error fetching teams from firebase', error);
//       }
//     } else {
//       setTeams([]);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTeams(selectedSeason);
//   }, [selectedSeason, fetchTeams]);

//   const handleSave = async editedTeam => {
//     try {
//       await Updates.updateTeamData(editedTeam.id, editedTeam);
//       const updatedTeams = teams.map(team =>
//         team.id === selectedTeam.id ? editedTeam : team,
//       );
//       setTeams(updatedTeams);
//       setSelectedTeam(null);
//     } catch (error) {
//       console.error(`Error updating team data: ${error}`, error);
//     }
//   };

//   const handleDelete = async teamToDelete => {
//     if (window.confirm(`Are you sure you want to delete ${teamToDelete.teamName}?`)) {
//       try {
//         await Updates.removeTeamFromSeason(selectedSeason.seasonName, teamToDelete.id);
//         setSelectedTeam(null);
//         fetchTeams(selectedSeason);
//       } catch (error) {
//         console.error(`Error removing team: ${error}`, error);
//       }
//     }
//   };

//   const handleAddTeam = async team => {
//     try {
//       await Posts.addNewTeamToSeason(selectedSeason.id, team);
//       fetchTeams(selectedSeason);
//     } catch (error) {
//       console.error(`Error adding new team: ${error}`, error);
//     }
//   };

//   return (
//     <div className={styles.container}>
//       <div>
//         <SeasonList
//           seasons={seasons}
//           selectedSeason={selectedSeason}
//           setSelectedSeason={setSelectedSeason}
//         />
//         <TeamsList
//           teams={teams}
//           selectedTeam={selectedTeam}
//           setSelectedTeam={setSelectedTeam}
//         />
//         <NameMeButton onAdd={handleAddTeam} label="Add Team" />
//       </div>
//       <div>
//         {selectedTeam && (
//           <TeamDetails
//             playerData={pastPlayerData}
//             team={selectedTeam}
//             onSave={handleSave}
//             onDelete={handleDelete}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Teams;
