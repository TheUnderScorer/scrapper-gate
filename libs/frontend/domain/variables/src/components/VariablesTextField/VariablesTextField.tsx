import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import { FieldProps, FormBlockEditor } from '@scrapper-gate/frontend/form';
import React from 'react';
import { createVariablesDecorators } from '../../createVariablesDecorators';

export interface VariablesTextFieldProps
  extends Omit<BlockEditorProps, 'name'> {
  name: string;
  fieldProps?: FieldProps<string>;
}

const decorators = createVariablesDecorators();

export const VariablesTextField = ({
  variant,
  ...rest
}: VariablesTextFieldProps) => {
  return (
    <FormBlockEditor variant={variant} {...rest} decorators={decorators} />
  );
};
