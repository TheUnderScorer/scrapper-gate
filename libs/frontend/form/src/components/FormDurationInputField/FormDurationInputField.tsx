import { DurationInputField } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldError } from '../../hooks/useFieldError';
import { FormDurationInputFieldProps } from './FormDurationInputField.types';

export const FormDurationInputField = ({
  fieldProps,
  name,
  ...rest
}: FormDurationInputFieldProps) => {
  const field = useField(name, fieldProps);
  const valueField = useField(`${name}.value`);

  const error = useFieldError({
    meta: field.meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <DurationInputField
      {...rest}
      {...field.input}
      error={Boolean(error)}
      helperText={error ? valueField.meta.error.message : rest?.helperText}
      id={rest?.id ?? name}
    />
  );
};
