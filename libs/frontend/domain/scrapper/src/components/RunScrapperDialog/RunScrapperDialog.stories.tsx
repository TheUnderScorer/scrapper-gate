import { MockedProvider } from '@apollo/client/testing';
import { Button } from '@mui/material';
import { DialogController, useDialog } from '@scrapper-gate/frontend/dialogs';
import {
  ScrapperForRunFragment,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import { MemoryRouter } from 'react-router-dom';
import { RunScrapperDialog, runScrapperDialogId } from './RunScrapperDialog';

export default {
  title: 'Run scrapper dialog',
};

export const Component = () => {
  return (
    <div>
      <MockedProvider mocks={[]}>
        <MemoryRouter>
          <DialogController>
            <BaseComponent />
          </DialogController>
        </MemoryRouter>
      </MockedProvider>
    </div>
  );
};

const scrapper: ScrapperForRunFragment = {
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
