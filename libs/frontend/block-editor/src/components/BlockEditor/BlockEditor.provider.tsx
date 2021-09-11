import React, { PropsWithChildren } from 'react';
import { createEditor, Editor } from 'slate';
import { createContext, useContext } from 'use-context-selector';

export interface BlockEditorProviderProps {
  focused: boolean;
  editor: Editor;
}

const Context = createContext<BlockEditorProviderProps>({
  focused: false,
  editor: createEditor(),
});

export const useBlockEditorContext = () => useContext(Context);

export const BlockEditorProvider = ({
  children,
  focused,
  editor,
}: PropsWithChildren<BlockEditorProviderProps>) => {
  return (
    <Context.Provider value={{ focused, editor }}>{children}</Context.Provider>
  );
};
