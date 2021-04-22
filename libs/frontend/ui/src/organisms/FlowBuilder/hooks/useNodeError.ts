import { useFormState } from 'react-hook-form';

export const useNodeError = (nodeId: string) => {
  const formState = useFormState();

  return formState.errors?.invalidNodes?.[nodeId] as string | undefined;
};
