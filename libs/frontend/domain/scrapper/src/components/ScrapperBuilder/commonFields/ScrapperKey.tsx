import React from 'react';
import { FieldNameCreator, FormTextField } from '@scrapper-gate/frontend/form';

interface ScrapperKeyProps {
  disabled?: boolean;
  fieldNameCreator: FieldNameCreator;
}

export const ScrapperKey = ({
  disabled,
  fieldNameCreator,
}: ScrapperKeyProps) => (
  <FormTextField
    helperText="Helpful in identifying steps."
    disabled={disabled}
    label="Step name"
    name={fieldNameCreator('key')}
  />
);
