import { PropsOf } from '@emotion/react';
import { TextFieldProps } from '@mui/material';
import { Ref } from 'react';
import { Editor } from 'slate';
import { Slate } from 'slate-react';
import { Decorator } from '../../Decorator';
import { SerializeStrategy } from '../../types';

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
    | 'sx'
  > {
  initialFocused?: boolean;
  editorInstanceRef?: Ref<Editor>;
  decorators?: Decorator[];
  serializeStrategy?: SerializeStrategy;
  onChange?: (text: string | undefined) => unknown;

  value?: string;
  // Used in case if value was passed as date
  // Ex. use case - <VariablesDateField />
  dateFormat?: string;
}
