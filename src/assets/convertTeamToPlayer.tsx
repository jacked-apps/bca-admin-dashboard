export const convertToTeamPlayer = pastPlayer => {
  // Helper function to only add fields that are not undefined
  const addFieldIfDefined = (obj, key, value) => {
    if (value !== undefined && value !== null && value !== '') {
      obj[key] = value;
    }
  };

  // Start with an empty object
  const teamPlayer = {};

  // Add fields only if they are defined
  addFieldIfDefined(teamPlayer, 'firstName', pastPlayer.firstName);
  addFieldIfDefined(teamPlayer, 'lastName', pastPlayer.lastName);
  addFieldIfDefined(teamPlayer, 'nickname', pastPlayer.nickname);
  addFieldIfDefined(teamPlayer, 'currentUserId', pastPlayer.currentUserId);
  addFieldIfDefined(teamPlayer, 'pastPlayerId', pastPlayer.id);
  addFieldIfDefined(teamPlayer, 'email', pastPlayer.email);

  // Calculate wins and losses, ensure they are not undefined before adding
  const totalWins =
    safeParseInt(pastPlayer.seasonOneWins) +
    safeParseInt(pastPlayer.seasonTwoWins) +
    safeParseInt(pastPlayer.seasonThreeWins);
  const totalLosses =
    safeParseInt(pastPlayer.seasonOneLosses) +
    safeParseInt(pastPlayer.seasonTwoLosses) +
    safeParseInt(pastPlayer.seasonThreeLosses);

  addFieldIfDefined(teamPlayer, 'totalWins', totalWins);
  addFieldIfDefined(teamPlayer, 'totalLosses', totalLosses);

  return teamPlayer;
};
