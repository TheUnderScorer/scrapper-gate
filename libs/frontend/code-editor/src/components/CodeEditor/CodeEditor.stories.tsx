import { Box } from '@mui/material';
import { useState } from 'react';
import { CodeEditor } from './CodeEditor';

export default {
  title: 'CodeEditor',
};

export const SimpleWithJsLib = () => {
  const [value, setValue] = useState<string | undefined>(
    '// Write your code here.'
  );

  return (
    <Box width="600px" height="600px">
      <CodeEditor
        value={value}
        onChange={setValue}
        language="javascript"
        additionalJsLib={`
              type Variable = {
                name: string;
                value: any;
              };

              declare const variables: Record<string, Variable | undefined>
            `}
      />
    </Box>
  );
};

export const Runnable = () => {
  const [value, setValue] = useState<string | undefined>(
    '// Write your code here.'
  );

  return (
    <Box width="600px" height="600px">
      <CodeEditor
        value={value}
        onChange={setValue}
        language="javascript"
        runnable
        additionalJsLib={`
              type Variable = {
                name: string;
                value: any;
              };

              declare const variables: Record<string, Variable | undefined>
            `}
        runProps={{
          additionalConstants: {
            variables: {
              test: {
                name: 'test',
                value: '123',
              },
            },
          },
        }}
      />
    </Box>
  );
};
