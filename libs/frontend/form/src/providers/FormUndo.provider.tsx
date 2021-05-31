import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';

import { throwError } from '@scrapper-gate/shared/common';
import React, {
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useHotkeys } from 'react-hotkeys-hook';
import { useDebounce } from 'react-use';
import { equals } from 'remeda';
import { createContext, useContext } from 'use-context-selector';

export interface FormUndoContext {
  redo: (e?: Event | SyntheticEvent) => void;
  undo: (e?: Event | SyntheticEvent) => void;
  canRedo: boolean;
  canUndo: boolean;
  reset: () => void;
}

export interface FormUndoProviderProps {
  limit?: number;
}

const Context = createContext<FormUndoContext>({
  canRedo: false,
  canUndo: false,
  redo: throwError(),
  reset: throwError(),
  undo: throwError(),
});

export const useFormUndo = () => useContext(Context);

const initial = {
  past: [],
  present: null,
  future: [],
};

export const FormUndoProvider = ({
  children,
  limit,
}: PropsWithChildren<FormUndoProviderProps>) => {
  const doingUndoOrRedoRef = useRef(false);

  const shortcuts = useKeyboardShortcuts();

  const formApi = useForm();

  const [lastFormState, setLastFormState] = useState(formApi.getState().values);

  const [state, setState] = useState({
    ...initial,
    present: formApi.getState().values,
  });

  const reset = useCallback(() => {
    setState({
      ...initial,
      present: formApi.getState().values,
    });
  }, [formApi]);

  const onValuesChange = useCallback(
    (formValues: Record<string, unknown>) => {
      setState((prevState) => {
        const { past, present } = prevState;

        if (!equals(present, formValues) && !doingUndoOrRedoRef.current) {
          const newPast = [...past, present];

          if (newPast.length > limit) {
            newPast.splice(0, 1);
          }

          return {
            past: newPast,
            present: formValues,
            future: [],
          };
        } else {
          // doing undo or redo, do not add to the queue
          return prevState;
        }
      });
    },
    [limit]
  );

  const canUndo = useMemo(() => state.past.length > 0, [state.past.length]);
  const canRedo = useMemo(() => state.future.length > 0, [state.future.length]);

  const redo = useCallback(
    (e?: Event | SyntheticEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!canRedo) {
        return;
      }

      doingUndoOrRedoRef.current = true;

      setState(({ future, past, present }) => {
        const next = future[0];
        const newFuture = future.slice(1);

        formApi.reset(next);

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      });

      doingUndoOrRedoRef.current = false;
    },
    [canRedo, formApi]
  );

  const undo = useCallback(
    (e?: Event | SyntheticEvent) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (!canUndo) {
        return;
      }

      doingUndoOrRedoRef.current = true;

      setState(({ past, future, present }) => {
        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        formApi.reset(previous);

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      });

      doingUndoOrRedoRef.current = false;
    },
    [canUndo, formApi]
  );

  useHotkeys(shortcuts.undo, undo, [undo]);
  useHotkeys(shortcuts.redo, redo, [redo]);

  useFormState({
    subscription: {
      values: true,
    },
    onChange: (state) => setLastFormState(state.values),
  });

  useDebounce(() => onValuesChange(lastFormState), 350, [
    lastFormState,
    onValuesChange,
  ]);

  const value = useMemo<FormUndoContext>(
    () => ({
      undo,
      redo,
      canUndo,
      canRedo,
      reset,
    }),
    [canRedo, canUndo, redo, reset, undo]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
