import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import { FieldProps } from '../../types';

export interface FormBlockEditorProps
  extends Omit<BlockEditorProps, 'value' | 'onChange'> {
  name: string;
  fieldProps?: FieldProps<string>;
}
