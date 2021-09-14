import { FormApi } from 'final-form';
import React, { useCallback, useState } from 'react';
import { FormProps } from 'react-final-form';
import { ReferableForm } from '../components/ReferableForm/ReferableForm';

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
    () => (
      <ReferableForm
        {...props}
        onForm={(formApi) => {
          if (!form) {
            setForm(formApi);
          }
        }}
      />
    ),
    [form, props]
  );

  return {
    form,
    Form,
  };
};
