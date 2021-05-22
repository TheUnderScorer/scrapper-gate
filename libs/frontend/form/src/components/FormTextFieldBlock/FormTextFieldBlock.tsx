import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FieldProps } from '../../types';
import { TextFieldBlock } from '../TextFieldBlock/TextFieldBlock';
import { TextFieldBlockProps } from '../TextFieldBlock/TextFieldBlock.types';

export interface FormTextFieldBlockProps
  extends Omit<TextFieldBlockProps, 'value' | 'onChange'> {
  name: string;
  fieldProps?: FieldProps<string>;
}

export const FormTextFieldBlock = ({
  name,
  fieldProps,
  ...rest
}: FormTextFieldBlockProps) => {
  const { input, meta } = useField(name, fieldProps);

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <TextFieldBlock
      {...rest}
      {...input}
      error={hasError}
      helperText={hasError ? meta.error.message : rest.helperText}
    />
  );
};
