import { Link } from '@mui/material';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import React from 'react';

interface ScrapperKeyProps {
  disabled?: boolean;
  fieldNameCreator: FieldNameCreator;
}

export const ScrapperKey = ({
  disabled,
  fieldNameCreator,
}: ScrapperKeyProps) => (
  <VariablesTextField
    helperText={
      <>
        It will be used as an identifier for this step. <Link>Learn more</Link>
      </>
    }
    disabled={disabled}
    label="Step name"
    name={fieldNameCreator('key')}
  />
);
