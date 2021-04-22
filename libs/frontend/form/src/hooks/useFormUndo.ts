import { useCallback, useMemo, useRef, useState, SyntheticEvent } from 'react';
import { useDebounce } from 'react-use';
import { useFormContext } from 'react-hook-form';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { useHotkeys } from 'react-hotkeys-hook';
import { equals } from 'remeda';

const initial = {
  past: [],
  present: null,
  future: [],
};

export interface UseFormUndoProps {
  limit?: number;
}

export const useFormUndo = <FormValues extends unknown>({
  limit = 50,
}: UseFormUndoProps = {}) => {
  const doingUndoOrRedoRef = useRef(false);

  const shortcuts = useKeyboardShortcuts();

  const formApi = useFormContext<FormValues>();

  const [lastFormState, setLastFormState] = useState(
    formApi.getValues() as FormValues
  );

  const [state, setState] = useState({
    ...initial,
    present: formApi.getValues() as FormValues,
  });

  const onValuesChange = useCallback(
    (formValues: FormValues) => {
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
    (e?: SyntheticEvent | Event) => {
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
    (e?: SyntheticEvent | Event) => {
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

  formApi.watch((values) => {
    setLastFormState(values as FormValues);
  });

  useDebounce(() => onValuesChange(lastFormState), 350, [
    lastFormState,
    onValuesChange,
  ]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    queue: state,
  };
};
