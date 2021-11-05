import Editor from '@monaco-editor/react';
import React from 'react';
import { CodeEditorProps } from './CodeEditor.types';
import { CodeEditorToolbar } from './Toolbar/CodeEditorToolbar';

export const CodeEditor = ({
  additionalJsLib,
  additionalTsLib,
  onMount,
  runnable,
  runProps,
  ...props
}: CodeEditorProps) => {
  return (
    <>
      <Editor
        {...props}
        onMount={(editor, monaco) => {
          if (additionalTsLib) {
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              additionalTsLib
            );
          }

          if (additionalJsLib) {
            monaco.languages.typescript.javascriptDefaults.addExtraLib(
              additionalJsLib
            );
          }

          onMount?.(editor, monaco);
        }}
      />
      {runnable && <CodeEditorToolbar code={props.value ?? ''} {...runProps} />}
    </>
  );
};
