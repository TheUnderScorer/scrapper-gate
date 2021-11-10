import { ErrorObjectModel } from '@scrapper-gate/shared/errors';
import { logger } from '@scrapper-gate/shared/logger/console';
import { ErrorObject, Maybe } from '@scrapper-gate/shared/schema';
import { equals } from 'remeda';
import browser from 'webextension-polyfill';
import * as queue from './queue';
import { CodeEditorState } from './types';

export const createCodeEditorStoreKey = (sessionId: string) =>
  `code-editor-state-${sessionId}`;

export const updateEditorState = async (
  sessionId: string,
  state: CodeEditorState
) => {
  void queue
    .push(sessionId, async () => {
      const previousState = await getEditorState(sessionId);

      if (equals(previousState, state)) {
        logger.debug(`State for editor #${sessionId} was not changed.`);

        return;
      }

      logger.debug(`Setting editor state for #${sessionId}`, state);

      await browser.storage.local.set({
        [createCodeEditorStoreKey(sessionId)]: state,
      });
    })
    .catch(logger.error);
};

export const getEditorState = async (
  sessionId: string
): Promise<Maybe<CodeEditorState>> => {
  const key = createCodeEditorStoreKey(sessionId);

  const result = await browser.storage.local.get(key);

  return result[key];
};

export const setCodeEditorValue = async (sessionId: string, value?: string) => {
  const state = await getEditorState(sessionId);

  if (state) {
    if (state.value === value) {
      return;
    }

    state.value = value;

    logger.debug(`New value for editor #${sessionId}`, state.value);

    await updateEditorState(sessionId, state);
  }
};

export const setCodeEditorError = async (sessionId: string, error?: Error) => {
  const state = await getEditorState(sessionId);

  if (state) {
    const errorObj = error
      ? ErrorObjectModel.fromError(error).toJSON()
      : undefined;

    logger.debug(`New error for editor #${sessionId}:`, errorObj);
    logger.debug(`Previous error for editor #${sessionId}:`, state.error);

    const errorEqual =
      (!errorObj && !state.error) || equals(errorObj, state.error);

    logger.debug('Errors equal:', errorEqual);

    if (errorEqual) {
      return;
    }

    state.error = errorObj as ErrorObject | undefined;

    await updateEditorState(sessionId, state);
  }
};

export const cleanupCodeEditor = async (sessionId: string) => {
  await browser.storage.local.remove(createCodeEditorStoreKey(sessionId));

  queue.remove(sessionId);
};

export const subscribeToEditorStateChange = (
  sessionId: string,
  callback: (state?: Maybe<CodeEditorState>) => unknown
) => {
  const key = createCodeEditorStoreKey(sessionId);

  const listener = (
    changes: Record<string, browser.Storage.StorageChange>,
    areaName: string
  ) => {
    if (areaName === 'local' && changes[key]) {
      logger.debug(`State for editor #${sessionId} changed:`, {
        newValue: changes[key].newValue,
        oldValue: changes[key].oldValue,
      });

      callback(changes[key].newValue);
    }
  };

  browser.storage.onChanged.addListener(listener);

  return () => browser.storage.onChanged.removeListener(listener);
};
