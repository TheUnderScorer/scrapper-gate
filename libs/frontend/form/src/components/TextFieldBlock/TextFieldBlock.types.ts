import { TextFieldProps } from '@material-ui/core';
import { CompositeDecorator, ContentState } from 'draft-js';
import { ReactNode } from 'react';

export interface TextFieldBlockDecoratorComponentProps {
  children: ReactNode;
  contentState: ContentState;
  entityKey?: string;
  blockKey?: string;
  start: number;
  end: number;
  decoratedText: string;
}

export interface TextFieldBlockProps
  extends Pick<
    TextFieldProps,
    | 'helperText'
    | 'variant'
    | 'fullWidth'
    | 'label'
    | 'id'
    | 'size'
    | 'disabled'
    | 'InputProps'
    | 'placeholder'
    | 'onKeyUp'
    | 'onKeyDown'
    | 'onKeyPress'
    | 'inputProps'
    | 'className'
    | 'onFocus'
    | 'onBlur'
    | 'error'
  > {
  onChange?: (text: string) => unknown;
  decorator?: CompositeDecorator;
  value?: string;
  // Used in case if value was passed as date
  // Ex. use case - <VariablesDateField />
  dateFormat?: string;
}
