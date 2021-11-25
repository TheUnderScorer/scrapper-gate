import { DurationInputField } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FormDurationInputFieldProps } from './FormDurationInputField.types';

export const FormDurationInputField = ({
  fieldProps,
  name,
  ...rest
}: FormDurationInputFieldProps) => {
  const field = useField(name, fieldProps);
  const valueField = useField(`${name}.value`);

  const hasError = useFieldHasError({
    meta: field.meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <DurationInputField
      {...rest}
      {...field.input}
      error={hasError}
      helperText={hasError ? valueField.meta.error.message : rest?.helperText}
      id={rest?.id ?? name}
    />
  );
};
