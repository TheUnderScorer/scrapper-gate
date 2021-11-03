import { useFieldHasError } from '@scrapper-gate/frontend/form';
import { DurationInputField } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { useField } from 'react-final-form';
import { FormDurationInputFieldProps } from './FormDurationInputField.types';

export const FormDurationInputField = ({
  fieldProps,
  name,
  ...rest
}: FormDurationInputFieldProps) => {
  const field = useField(name, fieldProps);

  const hasError = useFieldHasError({
    meta: field.meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <DurationInputField
      {...rest}
      {...field.input}
      helperText={hasError ? field.meta.error.message : rest?.helperText}
      id={rest?.id ?? name}
    />
  );
};
