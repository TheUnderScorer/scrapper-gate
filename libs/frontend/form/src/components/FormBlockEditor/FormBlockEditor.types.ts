import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import { Ref } from 'react';
import { FormFieldProps } from '../../types';

export interface FormBlockEditorProps
  extends Omit<BlockEditorProps, 'value' | 'onChange' | 'name'>,
    FormFieldProps<string> {
  blockEditorRef?: Ref<HTMLInputElement>;
}
