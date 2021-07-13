import { Button, Stack } from '@material-ui/core';
import { BaseDialogProps, Dialog } from '@scrapper-gate/frontend/dialogs';
import { FormTextField } from '@scrapper-gate/frontend/form';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import {
  CreateScrapperInput,
  CreateScrapperMutation,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { useDialogMethods } from '../../../../../dialogs/src/useDialogMethods';
import { useCreateScrapper } from '../../hooks/useCreateScrapper';
import { ScrapperTypeSelection } from '../ScrapperTypeSelection/ScrapperTypeSelection';

export interface CreateScrapperFormProps extends BaseDialogProps {
  onCreate?: (scrapper: CreateScrapperMutation['createScrapper']) => unknown;
}

export const createScrapperDialogId = 'CREATE_SCRAPPER_DIALOG';

export const CreateScrapperFormDialog = ({
  onCreate,
  onCancel,
}: CreateScrapperFormProps) => {
  const { pull } = useDialogMethods({
    id: createScrapperDialogId,
    onCancel,
  });

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

      pull();
    },
    [createScrapper, onCreate, pull]
  );

  return (
    <Form
      initialValues={{
        type: ScrapperType.Simple,
      }}
      onSubmit={handleSubmit}
      render={(props) => (
        <Dialog
          id={createScrapperDialogId}
          loading={loading}
          onCancel={onCancel}
          actions={
            <Button
              onClick={() => props.handleSubmit()}
              variant="contained"
              color="primary"
              type="submit"
            >
              Create scrapper
            </Button>
          }
          maxWidth="xl"
          title="Create scrapper"
        >
          <Stack spacing={4}>
            <ScrapperTypeSelection name="type" />
            <FormTextField
              label="Scrapper name"
              name="name"
              helperText="Optional scrapper name."
            />
          </Stack>
        </Dialog>
      )}
    />
  );
};
