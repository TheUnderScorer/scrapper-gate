import {
  FormBlockEditor,
  FormBlockEditorProps,
} from '@scrapper-gate/frontend/form';
import React from 'react';
import { createVariablesDecorators } from '../../createVariablesDecorators';

export type VariablesTextFieldProps = Omit<FormBlockEditorProps, 'decorators'>;

const decorators = createVariablesDecorators();

export const VariablesTextField = ({
  variant,
  ...rest
}: VariablesTextFieldProps) => {
  return (
    <FormBlockEditor variant={variant} {...rest} decorators={decorators} />
  );
};
