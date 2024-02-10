import { toast } from 'react-toastify';
import { Team } from '../assets/typesFolder/teamTypes';

export type HookProps = {
  useToast?: boolean;
  successToastLength?: number;
  successMessage?: string;
  failedMessage?: string;
  onFetchSuccess?: (team: Team[]) => void;
};

export const mutationConfig = (props: HookProps) => ({
  onSuccess: (data: Team[]) => {
    const toastOptions = props.successToastLength
      ? { autoClose: props.successToastLength }
      : {};
    if (props.useToast) toast.success(props.successMessage, toastOptions);
    if (props.onFetchSuccess) props.onFetchSuccess(data);
  },
  onError: (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    toast.error(props.failedMessage + errorMessage);
  },
});
