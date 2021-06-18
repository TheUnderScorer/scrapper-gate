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
    helperText="Will be used as value key."
    disabled={disabled}
    label="Step name"
    name={fieldNameCreator('key')}
  />
);
