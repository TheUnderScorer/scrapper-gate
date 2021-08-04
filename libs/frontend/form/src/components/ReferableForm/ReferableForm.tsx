import { voidFn } from '@scrapper-gate/shared/common';
import { FormApi } from 'final-form';
import React from 'react';
import { Form, FormProps } from 'react-final-form';

export interface ReferableFormProps<
  FormValues = Record<string, unknown>,
  InitialFormValues = Partial<FormValues>
> extends FormProps<FormValues, InitialFormValues> {
  onForm: (form: FormApi<FormValues, InitialFormValues>) => unknown;
}

export const ReferableForm = <
  FormValues extends unknown = Record<string, unknown>,
  InitialFormValues extends unknown = Partial<FormValues>
>({
  onForm,
  ...props
}: ReferableFormProps<FormValues, InitialFormValues>) => (
  <Form
    {...props}
    decorators={[
      ...(props.decorators ?? []),
      (form) => {
        onForm(form);

        return voidFn;
      },
    ]}
  />
);
