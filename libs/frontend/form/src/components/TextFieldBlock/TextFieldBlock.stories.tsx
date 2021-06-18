import { Box, Button, TextField } from '@material-ui/core';
import { matchAllIndexes } from '@scrapper-gate/shared/common';
import { CompositeDecorator } from 'draft-js';
import React, { PropsWithChildren, useState } from 'react';
import { TextFieldBlock } from './TextFieldBlock';

export default {
  title: 'UI/Text field block',
};

const initialValue = '{{HTML}} Content';

const decorator = new CompositeDecorator([
  {
    strategy: (block, callback) => {
      const text = block.getText();

      const matches = matchAllIndexes(text, /{{([^}]+)}}/g);

      matches.forEach(([startIndex, endIndex]) => {
        callback(startIndex, endIndex);
      });
    },
    component: (props: PropsWithChildren<unknown>) => {
      return (
        <span>
          <Button
            onMouseEnter={() => {
              console.log('mouse enter');
            }}
            style={{ padding: 0 }}
          >
            {props.children}
          </Button>
        </span>
      );
    },
  },
]);

export const WithCustomBlurContent = () => {
  const [value, setValue] = useState(initialValue);

  console.log({ value });

  return (
    <Box width={500}>
      <TextFieldBlock
        label="Text field block"
        decorator={decorator}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        value={value}
      />
      <Box mt={2}>
        <TextField label="Regular field" value="Test" />
      </Box>
    </Box>
  );
};
