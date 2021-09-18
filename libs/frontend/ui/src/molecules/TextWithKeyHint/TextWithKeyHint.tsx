import React, { FC } from 'react';
import { Stack } from '@mui/material';
import { KeyHint } from '../../atoms/KeyHint/KeyHint';
import { TooltipText } from '../../atoms/TooltipText/TooltipText';

export interface TextWithKeyHintProps {
  keyHint?: string;
}

export const TextWithKeyHint: FC<TextWithKeyHintProps> = ({
  children,
  keyHint,
}) => {
  return (
    <Stack
      direction="column"
      spacing={1}
      justifyItems="center"
      alignItems="center"
    >
      <TooltipText>{children}</TooltipText>
      {keyHint && <KeyHint>{keyHint}</KeyHint>}
    </Stack>
  );
};
