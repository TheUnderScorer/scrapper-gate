import { Stack } from '@mui/material';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { Scoped } from '@scrapper-gate/frontend/ui';
import { useState } from 'react';
import { Decorator } from '../../Decorator';
import { BlockEditor } from './BlockEditor';

export default {
  title: 'BlockEditor',
};

const decorators = [
  new Decorator(/<([^}]+)>/g, 'test', (props) => {
    return (
      <pre {...props.attributes} style={{ display: 'inline-block', margin: 0 }}>
        <code>{props.children}</code>
      </pre>
    );
  }),
];

export const BaseEditor = () => {
  const [value, setValue] = useState<string>('Hello world!');

  return (
    <Stack direction="column" spacing={2}>
      <BlockEditor
        value={value}
        onChange={setValue}
        label="Editor"
        decorators={decorators}
      />
      <BlockEditor
        value={value}
        onChange={setValue}
        error
        helperText="Error!"
        decorators={decorators}
      />
      <BlockEditor
        value={value}
        onChange={setValue}
        variant="filled"
        decorators={decorators}
      />
      <BlockEditor
        value={value}
        onChange={setValue}
        variant="standard"
        decorators={decorators}
      />
    </Stack>
  );
};

export const InShadowDom = () => {
  const [value, setValue] = useState<string>('Hello world from shadow dom!');

  return (
    <Scoped>
      {(shadowRoot, container) => (
        <div>
          <ThemeProvider container={container}>
            <BlockEditor
              value={value}
              onChange={setValue}
              decorators={decorators}
            />
          </ThemeProvider>
        </div>
      )}
    </Scoped>
  );
};
