import { Box } from '@mui/material';
import { CodeEditorProps } from './CodeEditor.types';
import { Meta } from '@storybook/react';
import { useState } from 'react';
import { CodeEditor as Editor } from './CodeEditor';

export default {
  title: 'CodeEditor',
  component: Editor,
  args: {
    language: 'javascript',
    additionalJsLib: `
              type Variable = {
                name: string;
                value: any;
              };

              declare const variables: Record<string, Variable | undefined>
            `,
  },
} as Meta;

export const CodeEditor = (
  props: Omit<CodeEditorProps, 'value' | 'onChange'>
) => {
  const [value, setValue] = useState<string | undefined>(
    '// Write your code here.'
  );

  return (
    <Box width="600px" height="600px">
      <Editor value={value} onChange={setValue} {...props} />
    </Box>
  );
};
