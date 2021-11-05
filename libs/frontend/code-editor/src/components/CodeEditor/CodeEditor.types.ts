import { EditorProps } from '@monaco-editor/react';
import { UseCodeRunnerParams } from '../../hooks/useCodeRunner';

export type TestType = {
  type: string;
};

export interface CodeEditorProps extends EditorProps {
  additionalTsLib?: string;
  additionalJsLib?: string;
  runnable?: boolean;
  runProps?: Omit<UseCodeRunnerParams, 'code'>;
}
