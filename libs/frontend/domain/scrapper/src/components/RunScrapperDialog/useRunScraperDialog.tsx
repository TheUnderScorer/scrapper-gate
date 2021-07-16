import { useDialog } from '@scrapper-gate/frontend/dialogs';
import { useCallback } from 'react';
import { RunScrapperDialog, runScrapperDialogId } from './RunScrapperDialog';
import { RunScrapperDialogProps } from './RunScrapperDialog.types';

export const useRunScraperDialog = (props: RunScrapperDialogProps) => {
  const { push } = useDialog();

  return useCallback(
    () =>
      new Promise<void>((resolve) =>
        push({
          id: runScrapperDialogId,
          content: <RunScrapperDialog {...props} onRun={resolve} />,
        })
      ),
    [props, push]
  );
};
