import { ScrapperCodeEditorProps } from '@scrapper-gate/frontend/domain/scrapper';
import { setErrorMutator } from '@scrapper-gate/frontend/form';
import { ErrorObjectModel } from '@scrapper-gate/shared/errors';
import { Maybe } from '@scrapper-gate/shared/schema';
import { useCallback, useEffect, useState } from 'react';
import { useField, useForm } from 'react-final-form';
import { equals } from 'remeda';
import { v4 } from 'uuid';
import {
  cleanupCodeEditor,
  subscribeToEditorStateChange,
  updateEditorState,
} from '../../../../extension/browser/codeEditor/store';
import { CodeEditorState } from '../../../../extension/browser/codeEditor/types';

export const useIframeCodeEditor = (props: ScrapperCodeEditorProps) => {
  const { name, initialValue } = props;

  const {
    mutators: { setError },
  } = useForm();

  const field = useField(name, {
    initialValue,
    validate: setErrorMutator.validate,
  });

  const {
    input: { value, onChange },
    meta: { error },
  } = field;

  const [sessionId, setSessionId] = useState(v4());
  const [state, setState] = useState<CodeEditorState>({
    props,
    value,
  });

  useEffect(() => {
    updateEditorState(sessionId, state).catch(console.error);
  }, [sessionId, state]);

  useEffect(() => {
    const onStateChange = (newState: Maybe<CodeEditorState>) => {
      if (equals(newState, state)) {
        return;
      }

      if (newState) {
        if (newState.value !== value) {
          onChange(newState.value);
        }

        setState(newState);

        const newError = newState.error
          ? ErrorObjectModel.create(newState.error).toError()
          : undefined;

        setError(name, newError);
      }
    };

    return subscribeToEditorStateChange(sessionId, onStateChange);
  }, [name, onChange, sessionId, setError, state, value]);

  const reload = useCallback(async () => {
    await cleanupCodeEditor(sessionId);

    setSessionId(v4());
  }, [sessionId]);

  return {
    sessionId,
    value,
    reload,
    field,
    error,
  };
};
