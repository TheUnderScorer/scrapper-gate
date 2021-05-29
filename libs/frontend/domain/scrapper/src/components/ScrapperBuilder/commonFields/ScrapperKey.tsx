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
    helperText="Helpful in identifying steps."
    disabled={disabled}
    label="Step name"
    name={fieldNameCreator('key')}
  />
);
