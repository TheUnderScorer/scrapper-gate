import { BlockEditor } from '@scrapper-gate/frontend/block-editor';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldHasError } from '../../hooks/useFieldHasError';
import { FormBlockEditorProps } from './FormBlockEditor.types';

export const FormBlockEditor = ({
  decorators,
  name,
  fieldProps,
  ...rest
}: FormBlockEditorProps) => {
  const { input, meta } = useField(name);

  const hasError = useFieldHasError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <BlockEditor
      decorators={decorators}
      {...rest}
      {...input}
      error={hasError}
      helperText={hasError ? meta.error.message : rest.helperText}
    />
  );
};
