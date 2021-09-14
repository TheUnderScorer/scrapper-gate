import { voidFn } from '@scrapper-gate/shared/common';
import { Decorator, FormApi } from 'final-form';
import React, { useCallback, useMemo } from 'react';
import { Form, FormProps } from 'react-final-form';

export interface ReferableFormProps<
  FormValues = Record<string, unknown>,
  InitialFormValues = Partial<FormValues>
> extends FormProps<FormValues, InitialFormValues> {
  onForm: (form: FormApi<FormValues, InitialFormValues>) => unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const defaultDecorators: Decorator<any, any>[] = [];

export const ReferableForm = <
  FormValues extends unknown = Record<string, unknown>,
  InitialFormValues extends unknown = Partial<FormValues>
>({
  onForm,
  ...props
}: ReferableFormProps<FormValues, InitialFormValues>) => {
  const decorator = useCallback(
    (form: FormApi<FormValues, InitialFormValues>) => {
      onForm(form);

      return voidFn;
    },
    [onForm]
  );

  const decorators: Decorator<FormValues, InitialFormValues>[] = useMemo(
    () => [...(props.decorators ?? defaultDecorators), decorator],
    [decorator, props.decorators]
  );

  return <Form {...props} decorators={decorators} />;
};
