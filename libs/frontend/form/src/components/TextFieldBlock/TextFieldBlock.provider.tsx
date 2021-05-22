import { throwError } from '@scrapper-gate/shared/common';
import { EditorState } from 'draft-js';
import React, { PropsWithChildren } from 'react';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';

export interface TextFieldBlockProviderProps {
  editorState: EditorState;
  setEditorState: (editorState: EditorState) => void;
  focused: boolean;
}

const Context = createContext<TextFieldBlockProviderProps>({
  editorState: EditorState.createEmpty(),
  focused: false,
  setEditorState: throwError(),
});

export const useTextFieldBlockContext = () => useContext(Context);

export const useTextFieldBlockContextSelector = <Value extends unknown>(
  selector: (ctx: TextFieldBlockProviderProps) => Value
) => useContextSelector(Context, selector);

export const TextFieldBlockProvider = ({
  editorState,
  children,
  focused,
  setEditorState,
}: PropsWithChildren<TextFieldBlockProviderProps>) => {
  return (
    <Context.Provider value={{ editorState, focused, setEditorState }}>
      {children}
    </Context.Provider>
  );
};
