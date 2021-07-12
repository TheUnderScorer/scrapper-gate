import { Button, Stack } from '@material-ui/core';
import { useDialog } from '@scrapper-gate/frontend/dialogs';
import { FormTextField } from '@scrapper-gate/frontend/form';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import { CancelButton, SimpleDialog } from '@scrapper-gate/frontend/ui';
import {
  CreateScrapperInput,
  CreateScrapperMutation,
} from '@scrapper-gate/shared/schema';
import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { useCreateScrapper } from '../../hooks/useCreateScrapper';
import { ScrapperTypeSelection } from '../ScrapperTypeSelection/ScrapperTypeSelection';

export interface CreateScrapperFormProps {
  onCreate?: (scrapper: CreateScrapperMutation['createScrapper']) => unknown;
  onCancel?: () => unknown;
}

export const createScrapperDialogId = 'CREATE_SCRAPPER_DIALOG';

export const CreateScrapperFormDialog = ({
  onCreate,
  onCancel,
}: CreateScrapperFormProps) => {
  const { pull } = useDialog();

  const snackbarOnError = useSnackbarOnError();
  const [createScrapper, { loading }] = useCreateScrapper({
    onError: snackbarOnError,
  });

  const handleSubmit = useCallback(
    async (input: CreateScrapperInput) => {
      const result = await createScrapper({
        variables: {
          input,
        },
      });

      if (result.data?.createScrapper) {
        await onCreate?.(result.data.createScrapper);
      }

      pull(createScrapperDialogId);
    },
    [createScrapper, onCreate, pull]
  );

  const handleClose = useCallback(() => {
    onCancel?.();

    pull(createScrapperDialogId);
  }, [onCancel, pull]);

  return (
    <Form
      onSubmit={handleSubmit}
      render={(props) => (
        <SimpleDialog
          loading={loading}
          open
          actions={
            <Stack direction="row" spacing={1}>
              <CancelButton variant="outlined" onClick={handleClose}>
                Cancel
              </CancelButton>
              <Button
                onClick={() => props.handleSubmit()}
                variant="contained"
                color="primary"
                type="submit"
              >
                Create scrapper
              </Button>
            </Stack>
          }
          maxWidth="xl"
          title="Create scrapper"
          onClose={handleClose}
        >
          <Stack spacing={4}>
            <ScrapperTypeSelection name="type" />
            <FormTextField
              name="name"
              placeholder="Optional scrapper name..."
            />
          </Stack>
        </SimpleDialog>
      )}
    />
  );
};
