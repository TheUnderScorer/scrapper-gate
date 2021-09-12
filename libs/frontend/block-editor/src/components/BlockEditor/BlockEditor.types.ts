import { PropsOf } from '@emotion/react';
import { TextFieldProps } from '@material-ui/core';
import { Ref } from 'react';
import { Editor } from 'slate';
import { Slate } from 'slate-react';
import { Decorator } from '../../Decorator';

export type SlateProps = PropsOf<typeof Slate>;

export interface BlockEditorProps
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
    | 'name'
  > {
  initialFocused?: boolean;
  editorInstanceRef?: Ref<Editor>;
  decorators?: Decorator[];
  onChange?: (text: string) => unknown;

  value?: string;
  // Used in case if value was passed as date
  // Ex. use case - <VariablesDateField />
  dateFormat?: string;
}
