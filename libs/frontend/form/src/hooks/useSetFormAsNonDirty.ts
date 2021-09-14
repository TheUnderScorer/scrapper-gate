import { useCallback } from 'react';
import { useForm } from 'react-final-form';

export const useSetFormAsNonDirty = () => {
  const form = useForm();

  return useCallback(() => {
    form.reset(form.getState().values);
  }, [form]);
};
