import { CurrentUser, Email, Names, PastPlayer } from '../assets/types';
import { Updates } from '../firebase/firebaseFunctions';
import { formatName } from '../assets/globalFunctions';

export const handleUpdatePastPlayer = async (
  email: Email | null,
  fieldName: keyof PastPlayer,
  value: string,
) => {
  const data = { [fieldName]: value };
  try {
    if (email) {
      await Updates.updatePastPlayerProfile(email, data);
      alert(`${fieldName} updated successfully`);
    }
  } catch (error) {
    console.log('Error updating pastPlayer', error);
  }
};

export const handleUpdateCurrentUser = async (
  id: string | null,
  fieldName: keyof CurrentUser,
  value: string,
) => {
  const data = { [fieldName]: value };
  try {
    if (id) {
      await Updates.updateUserProfile(id, data);
      alert(`${fieldName} updated successfully`);
    }
  } catch (error) {
    console.log('Error updating currentUser', error);
  }
};
export const handleUpdateNames = async (
  email: Email | null,
  currentUserId: string | null,
  fieldName: keyof Names,
  value: string,
) => {
  if (fieldName !== 'nickname') {
    value = formatName(value);
  }
  handleUpdateCurrentUser(email, fieldName, value);
  handleUpdatePastPlayer(currentUserId, fieldName, value);
};
