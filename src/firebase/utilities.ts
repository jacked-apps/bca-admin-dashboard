import { toast } from 'react-toastify';

export type HookProps = {
  useToast?: boolean;
  successToastLength?: number;
  successMessage?: string;
  failedMessage?: string;
};

export const mutationConfig = (props: HookProps) => ({
  onSuccess: () => {
    const toastOptions = props.successToastLength
      ? { autoClose: props.successToastLength }
      : {};
    if (props.useToast) toast.success(props.successMessage, toastOptions);
  },
  onError: (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred.';
    toast.error(props.failedMessage + errorMessage);
  },
});
