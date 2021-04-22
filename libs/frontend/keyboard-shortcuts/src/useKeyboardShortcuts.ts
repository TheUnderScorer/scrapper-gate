import { useMemo } from 'react';
import { inArray, when } from '@theunderscorer/when';
import {
  getOperatingSystem,
  OperatingSystem,
} from '@scrapper-gate/frontend/common';

export const useKeyboardShortcuts = () => {
  const os = useMemo(() => getOperatingSystem(), []);

  return useMemo(
    () =>
      when(os, {
        [OperatingSystem.Mac]: {
          contentDrawer: {
            toggle: '[',
          },
          elementPicker: {
            toggleElementClicking: ']',
          },
          undo: 'command+z',
          redo: 'command+shift+z',
          selectAll: 'command+a',
        },
        [inArray(OperatingSystem.Windows, OperatingSystem.Linux)]: {
          contentDrawer: {
            toggle: '[',
          },
          elementPicker: {
            toggleElementClicking: ']',
          },
          undo: 'ctrl+z',
          redo: 'ctrl+shift+z',
          selectAll: 'ctrl+a',
        },
      }),
    [os]
  );
};
