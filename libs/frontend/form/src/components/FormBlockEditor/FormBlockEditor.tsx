import { BlockEditor } from '@scrapper-gate/frontend/block-editor';
import React from 'react';
import { useField } from 'react-final-form';
import { useFieldError } from '../../hooks/useFieldError';
import { FormBlockEditorProps } from './FormBlockEditor.types';

export const FormBlockEditor = ({
  decorators,
  name,
  fieldProps,
  blockEditorRef,
  ...rest
}: FormBlockEditorProps) => {
  const { input, meta } = useField(name);

  const error = useFieldError({
    meta,
    showErrorOnlyOnTouched: fieldProps?.showErrorOnlyOnTouched,
  });

  return (
    <BlockEditor
      decorators={decorators}
      {...rest}
      {...input}
      onFocus={(event) => {
        input.onFocus(event);
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        input.onBlur(event);
        rest.onBlur?.(event);
      }}
      ref={blockEditorRef}
      error={Boolean(error)}
      helperText={error ? error.message : rest.helperText}
    />
  );
};
