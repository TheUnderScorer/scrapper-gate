import { isIndexValid, last, throwError } from '@scrapper-gate/shared/common';
import React, { PropsWithChildren, useMemo } from 'react';
import { useList } from 'react-use';
import { createContext, useContext } from 'use-context-selector';
import { Dialog, DialogContext } from './types';

const Context = createContext<DialogContext>({
  pull: throwError(),
  push: throwError(),
});

export const useDialog = () => useContext(Context);

export const DialogController = ({ children }: PropsWithChildren<unknown>) => {
  const [dialogs, { push, removeAt }] = useList<Dialog>();

  const activeDialog = useMemo(() => last(dialogs), [dialogs]);

  const value = useMemo<DialogContext>(
    () => ({
      push,
      pull: (id) => {
        const index = dialogs.findIndex((item) => item.id === id);

        if (isIndexValid(index)) {
          removeAt(index);
        }
      },
    }),
    [push, removeAt, dialogs]
  );

  return (
    <Context.Provider value={value}>
      {children}
      {activeDialog?.content}
    </Context.Provider>
  );
};
