import { PastPlayer, TeamPlayerRole, TeamPlayer } from './types';

const safeParseInt = (value: string | undefined): number => {
  return parseInt(value ?? '0', 10) || 0;
};

const addFieldIfDefined = <T, K extends keyof T>(
  obj: T,
  key: K,
  value: T[K] | undefined,
) => {
  if (value !== undefined && value !== null && value !== '') {
    obj[key] = value;
  }
};

export const convertToTeamPlayer = (
  pastPlayer: PastPlayer,
  role: TeamPlayerRole,
): { [key in TeamPlayerRole]?: TeamPlayer } => {
  const teamPlayerInfo: Partial<TeamPlayer> = {};

  addFieldIfDefined(teamPlayerInfo, 'firstName', pastPlayer.firstName);
  addFieldIfDefined(teamPlayerInfo, 'lastName', pastPlayer.lastName);
  addFieldIfDefined(teamPlayerInfo, 'nickname', pastPlayer.nickname);
  addFieldIfDefined(teamPlayerInfo, 'currentUserId', pastPlayer.currentUserId);
  addFieldIfDefined(teamPlayerInfo, 'pastPlayerId', pastPlayer.id);
  addFieldIfDefined(teamPlayerInfo, 'email', pastPlayer.email);

  const totalWins =
    safeParseInt(pastPlayer.seasonOneWins) +
    safeParseInt(pastPlayer.seasonTwoWins) +
    safeParseInt(pastPlayer.seasonThreeWins);
  const totalLosses =
    safeParseInt(pastPlayer.seasonOneLosses) +
    safeParseInt(pastPlayer.seasonTwoLosses) +
    safeParseInt(pastPlayer.seasonThreeLosses);

  addFieldIfDefined(teamPlayerInfo, 'totalWins', totalWins);
  addFieldIfDefined(teamPlayerInfo, 'totalLosses', totalLosses);

  return { [role]: teamPlayerInfo as TeamPlayer };
};
