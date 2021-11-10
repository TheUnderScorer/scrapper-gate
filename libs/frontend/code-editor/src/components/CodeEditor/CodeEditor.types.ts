import { TextFieldProps } from '@mui/material';
import * as monaco from 'monaco-editor';
import { UseCodeRunnerParams } from '../../hooks/useCodeRunner';

export interface CodeEditorProps
  extends Pick<TextFieldProps, 'label' | 'helperText'> {
  additionalTsLib?: string;
  additionalJsLib?: string;
  runnable?: boolean;
  runProps?: Omit<UseCodeRunnerParams, 'code'>;
  onMount?: (editor: monaco.editor.IStandaloneCodeEditor) => unknown;
  value?: string;
  onChange?: (value?: string) => unknown;
  language?: string;
  onErrorChange?: (error?: Error) => unknown;
  hasError?: boolean;
}
