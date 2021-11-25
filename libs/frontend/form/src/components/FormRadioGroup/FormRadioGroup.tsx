import { RadioGroup } from '@scrapper-gate/frontend/ui';
import React, { useEffect } from 'react';
import { useField, useForm } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FormRadioGroupProps } from './FormRadioGroup.types';

export const FormRadioGroup = <T extends unknown>({
  name,
  fieldProps,
  helperText,
  ...rest
}: FormRadioGroupProps<T>) => {
  const { input, meta } = useField<T>(name, fieldProps);

  const { mutators } = useForm();

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  useEffect(() => {
    if (meta.dirty && !meta.touched) {
      mutators?.setFieldTouched?.(name, true);
    }
  }, [meta.dirty, meta.touched, mutators, name]);

  return (
    <RadioGroup
      {...rest}
      {...input}
      helperText={hasError ? meta.error?.message : helperText}
      error={hasError}
    />
  );
};
