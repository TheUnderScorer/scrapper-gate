import { FlowBuilderFormState } from '@scrapper-gate/frontend/ui';
import { useForm, useFormState } from 'react-final-form';
import { useState } from 'react';
import isEmpty from 'lodash.isempty';

export const useNodeError = (nodeId: string) => {
  const [error, setError] = useState<Error | undefined>();

  const form = useForm();

  useFormState({
    subscription: {
      errors: true,
    },
    onChange: () => {
      const formState = form.getState();

      if (isEmpty(formState.errors)) {
        setError(undefined);

        return;
      }

      if (formState.errors?.invalidNodes?.[nodeId]) {
        setError(formState.errors?.invalidNodes?.[nodeId]);

        return;
      }

      const index = (formState.values as FlowBuilderFormState)?.items?.findIndex(
        (item) => item.id === nodeId
      );

      const errors = formState.errors?.items?.[index];

      if (isEmpty(errors)) {
        setError(undefined);

        return;
      }

      if (error?.message !== 'Validation error') {
        setError(new Error('Validation error'));
      }
    },
  });

  return error;
};
