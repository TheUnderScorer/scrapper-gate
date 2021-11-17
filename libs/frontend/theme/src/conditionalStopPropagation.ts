import { KeyboardEvent } from 'react';
import { Key } from 'ts-key-enum';

const allowedKeys = [Key.ArrowUp, Key.ArrowDown, Key.Enter];

export const conditionalStopPropagation = (event: KeyboardEvent) => {
  if (allowedKeys.includes(event.key as Key)) {
    return;
  }

  event.stopPropagation();
};
