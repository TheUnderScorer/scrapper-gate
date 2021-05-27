import {
  FieldProps,
  FormTextFieldBlock,
  TextFieldBlockProps,
} from '@scrapper-gate/frontend/form';
import React from 'react';
import { createVariablesDecorator } from '../../createVariablesDecorator';

export interface VariablesTextFieldProps
  extends Omit<TextFieldBlockProps, 'name'> {
  name: string;
  fieldProps?: FieldProps<string>;
}

const decorator = createVariablesDecorator();

export const VariablesTextField = ({
  variant,
  ...rest
}: VariablesTextFieldProps) => {
  return (
    <FormTextFieldBlock variant={variant} {...rest} decorator={decorator} />
  );
};
