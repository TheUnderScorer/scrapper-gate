import { useState } from 'react';
import { OpenState } from './types';

export const makeUseMemoryOpenState =
  (initialOpen = false) =>
  (): OpenState => {
    const [open, setOpen] = useState(initialOpen);

    return {
      open,
      setOpen,
    };
  };
