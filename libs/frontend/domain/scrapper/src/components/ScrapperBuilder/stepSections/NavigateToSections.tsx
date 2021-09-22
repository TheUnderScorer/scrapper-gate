import React from 'react';
import { Grid } from '@mui/material';
import { Url } from '../commonFields/Url';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { useFormState } from 'react-final-form';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const NavigateToSections = ({
  nodeIndex,
  fieldNameCreator,
}: ScrapperStepFormProps) => {
  const formState = useFormState({
    subscription: {
      submitting: true,
    },
  });

  return (
    <>
      <Grid item>
        <ScrapperKey
          fieldNameCreator={fieldNameCreator}
          disabled={formState.submitting}
        />
      </Grid>
      <Grid item>
        <Url
          fieldNameCreator={fieldNameCreator}
          nodeIndex={nodeIndex}
          disabled={formState.submitting}
        />
      </Grid>
    </>
  );
};
