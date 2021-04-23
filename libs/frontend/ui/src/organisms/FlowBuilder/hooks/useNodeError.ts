import { useFormState } from 'react-final-form';

export const useNodeError = (nodeId: string) => {
  const formState = useFormState({
    subscription: {
      errors: true,
    },
  });

  return formState.errors?.invalidNodes?.[nodeId] as string | undefined;
};
