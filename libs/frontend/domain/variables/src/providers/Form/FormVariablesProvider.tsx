import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import { Variable } from '@scrapper-gate/shared/schema';
import { PropsWithChildren } from 'react';
import {
  defaultValue,
  VariableProviderProps,
  VariablesProvider,
} from '../VariablesProvider';

export const defaultVariablesFormField = 'variables';

export interface FormVariablesProviderProps
  extends Omit<VariableProviderProps, 'variables'> {
  name?: string;
}

export const FormVariablesProvider = ({
  name = defaultVariablesFormField,
  children,
  filter,
}: PropsWithChildren<FormVariablesProviderProps>) => {
  const variables = useFormFieldValue<Variable[]>(name, defaultValue);

  return (
    <VariablesProvider variables={variables ?? []} filter={filter}>
      {children}
    </VariablesProvider>
  );
};
