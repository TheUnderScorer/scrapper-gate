import { MockedProvider } from '@apollo/client/testing';
import { Button } from '@mui/material';
import { DialogController, useDialog } from '@scrapper-gate/frontend/dialogs';
import {
  createScrapperDialogId,
  CreateScrapperFormDialog,
} from './CreateScrapperFormDialog';

export default {
  title: 'Create scrapper dialog',
};

const BaseComponent = () => {
  const { push } = useDialog();

  return (
    <div>
      <Button
        onClick={() =>
          push({
            id: createScrapperDialogId,
            content: <CreateScrapperFormDialog />,
          })
        }
      >
        Show dialog
      </Button>
    </div>
  );
};

export const Component = () => (
  <MockedProvider>
    <DialogController>
      <BaseComponent />
    </DialogController>
  </MockedProvider>
);
