import {
  useCallback,
  useMemo,
  useRef,
  useState,
  SyntheticEvent,
  useEffect,
} from 'react';
import { useDebounce } from 'react-use';
import {
  DeepPartial,
  Path,
  UnpackNestedValue,
  useFormContext,
} from 'react-hook-form';
import { useKeyboardShortcuts } from '@scrapper-gate/frontend/keyboard-shortcuts';
import { useHotkeys } from 'react-hotkeys-hook';
import { equals, forEachObj } from 'remeda';

const initial = {
  past: [],
  present: null,
  future: [],
};

export interface UseFormUndoProps<FormValues extends Record<string, unknown>> {
  limit?: number;
  onUndo?: (values: FormValues) => unknown;
  onRedo?: (values: FormValues) => unknown;
}

export const useFormUndo = <FormValues extends Record<string, unknown>>({
  limit = 50,
  onRedo,
  onUndo,
}: UseFormUndoProps<FormValues> = {}) => {
  const doingUndoOrRedoRef = useRef(false);

  const shortcuts = useKeyboardShortcuts();

  const { getValues, watch, reset } = useFormContext<FormValues>();

  const [lastFormState, setLastFormState] = useState(getValues() as FormValues);

  const [state, setState] = useState({
    ...initial,
    present: getValues() as FormValues,
  });

  const handleValuesChange = useCallback(
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

  const updateForm = useCallback(
    (values: FormValues, type: 'undo' | 'redo') => {
      reset(values as UnpackNestedValue<DeepPartial<FormValues>>);

      type === 'undo' ? onUndo?.(values) : onRedo?.(values);
    },
    [onRedo, onUndo, reset]
  );

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

        updateForm(next, 'redo');

        return {
          past: [...past, present],
          present: next,
          future: newFuture,
        };
      });

      doingUndoOrRedoRef.current = false;
    },
    [canRedo, updateForm]
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

        updateForm(previous, 'undo');

        return {
          past: newPast,
          present: previous,
          future: [present, ...future],
        };
      });

      doingUndoOrRedoRef.current = false;
    },
    [canUndo, updateForm]
  );

  useHotkeys(shortcuts.undo, undo, [undo]);
  useHotkeys(shortcuts.redo, redo, [redo]);

  const values = watch();

  useEffect(() => {
    if (equals(values, lastFormState)) {
      return;
    }

    setLastFormState(values as FormValues);
  }, [lastFormState, values]);

  useDebounce(() => handleValuesChange(lastFormState), 350, [
    lastFormState,
    handleValuesChange,
  ]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    queue: state,
  };
};
