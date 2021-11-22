import { debounce } from '@mui/material';
import { Maybe } from '@scrapper-gate/shared/schema';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMount } from 'react-use';
import {
  getEditorState,
  setCodeEditorError,
  setCodeEditorValue,
  subscribeToEditorStateChange,
} from '../../../../extension/browser/codeEditor/store';
import { CodeEditorState } from '../../../../extension/browser/codeEditor/types';

export const usePopupCodeEditor = (sessionId: string) => {
  const [editorState, setEditorState] = useState<CodeEditorState>();

  useEffect(() => {
    const onStateChange = (state?: Maybe<CodeEditorState>) => {
      if (state) {
        setEditorState(state);
      }
    };

    return subscribeToEditorStateChange(sessionId, onStateChange);
  }, [sessionId]);

  const handleChange = useCallback(
    async (value?: string) => {
      await setCodeEditorValue(sessionId, value);
    },
    [sessionId]
  );

  const handleError = useCallback(
    async (error?: Error) => {
      await setCodeEditorError(sessionId, error);
    },
    [sessionId]
  );

  const debouncedHandleError = useMemo(
    () => debounce(handleError, 100),
    [handleError]
  );

  const debouncedHandleChange = useMemo(
    () => debounce(handleChange, 250),
    [handleChange]
  );

  useMount(() => {
    getEditorState(sessionId).then((state) => {
      if (state) {
        setEditorState(state);
      }
    });
  });

  return {
    editorState,
    handleChange: debouncedHandleChange,
    handleError: debouncedHandleError,
  };
};
