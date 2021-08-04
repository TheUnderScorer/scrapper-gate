import { ReferableForm } from '@scrapper-gate/frontend/form';
import { FormApi } from 'final-form';
import React, { useCallback, useState } from 'react';
import { FormProps } from 'react-final-form';

/**
 * Provides direct access to FormApi from component in which <Form /> is used.
 * */
export const useRefereableForm = <
  FormValues extends unknown = Record<string, unknown>,
  InitialFormValues extends unknown = Partial<FormValues>
>(
  props: FormProps<FormValues, InitialFormValues>
) => {
  const [form, setForm] = useState<FormApi<
    FormValues,
    InitialFormValues
  > | null>(null);

  const Form = useCallback(
    () => <ReferableForm {...props} onForm={setForm} />,
    [props]
  );

  return {
    form,
    Form,
  };
};
