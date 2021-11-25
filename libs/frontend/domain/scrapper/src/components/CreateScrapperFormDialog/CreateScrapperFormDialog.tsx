import { Button, Stack } from '@mui/material';
import {
  BaseDialogProps,
  Dialog,
  useDialogMethods,
} from '@scrapper-gate/frontend/dialogs';
import {
  FormTextField,
  joiValidationResolver,
  setFieldTouched,
} from '@scrapper-gate/frontend/form';
import { useSnackbarOnError } from '@scrapper-gate/frontend/snackbars';
import {
  CreateScrapperInput,
  CreateScrapperMutation,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import { CreateScrapperInputSchema } from '@scrapper-gate/shared/validation';
import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { useCreateScrapper } from '../../hooks/useCreateScrapper';
import { ScrapperTypeSelection } from '../ScrapperTypeSelection/ScrapperTypeSelection';

export interface CreateScrapperFormProps extends BaseDialogProps {
  onCreate?: (scrapper: CreateScrapperMutation['createScrapper']) => unknown;
}

export const createScrapperDialogId = 'CREATE_SCRAPPER_DIALOG';

const validate = joiValidationResolver(CreateScrapperInputSchema);

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
          input: {
            ...input,
            name: input.name ?? '',
          },
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
      mutators={{
        setFieldTouched,
      }}
      onSubmit={handleSubmit}
      validate={validate}
      render={(props) => (
        <Dialog
          onSubmit={props.handleSubmit}
          id={createScrapperDialogId}
          loading={loading}
          onCancel={onCancel}
          actions={
            <Button variant="contained" color="primary" type="submit">
              Create scrapper
            </Button>
          }
          maxWidth="xl"
          title="Create scrapper"
        >
          <Stack
            sx={{
              paddingTop: (theme) => theme.spacing(1),
            }}
            className="create-scrapper-form"
            spacing={4}
          >
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
