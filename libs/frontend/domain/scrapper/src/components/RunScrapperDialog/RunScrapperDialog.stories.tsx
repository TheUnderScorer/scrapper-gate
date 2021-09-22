import { Button } from '@mui/material';
import { DialogController, useDialog } from '@scrapper-gate/frontend/dialogs';
import { ScrapperType } from '@scrapper-gate/shared/schema';
import { RunScrapperDialog, runScrapperDialogId } from './RunScrapperDialog';
import { ScrapperForRun } from './RunScrapperDialog.types';

export default {
  title: 'Run scrapper dialog',
};

export const Component = () => {
  return (
    <DialogController>
      <BaseComponent />
    </DialogController>
  );
};

const scrapper: ScrapperForRun = {
  id: 'id',
  type: ScrapperType.RealBrowser,
  isRunning: false,
  name: 'Test scrapper',
  steps: [
    {
      id: 'id',
    },
  ],
};

const BaseComponent = () => {
  const { push } = useDialog();

  return (
    <Button
      onClick={() =>
        push({
          id: runScrapperDialogId,
          content: <RunScrapperDialog scrapper={scrapper} />,
        })
      }
    >
      Run scrapper
    </Button>
  );
};
