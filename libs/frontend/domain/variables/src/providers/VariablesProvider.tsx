import { useFormFieldValue } from '@scrapper-gate/frontend/form';
import {
  getTextVariableTemplate,
  TemplateType,
} from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { PropsWithChildren, useMemo } from 'react';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';

export interface VariablesProviderContext {
  variables: Variable[];
  // Record with mapped keys and matching variable. Key is formatted with template brackets, ex. {{My Variable}}: Variable
  mappedVariables: Record<string, Variable>;

  // Filtered variable, here every variable must have a key
  filteredVariables: Variable[];
}

export interface VariableProviderProps {
  // Name of form field under which variables are stored
  name: string;
}

const Context = createContext<VariablesProviderContext>({
  variables: [],
  mappedVariables: {},
  filteredVariables: [],
});

export const useVariablesContext = () => useContext(Context);

export const useVariablesContextSelector = <Value extends unknown>(
  selector: (ctx: VariablesProviderContext) => Value
) => useContextSelector(Context, selector);

const defaultValue = [];

export const VariablesProvider = ({
  name,
  children,
}: PropsWithChildren<VariableProviderProps>) => {
  const variables = useFormFieldValue<Variable[]>(name, defaultValue);

  const mappedVariables = useMemo(
    () =>
      variables.reduce((acc, variable) => {
        const key = getTextVariableTemplate(variable.key, TemplateType.Braces);

        return {
          ...acc,
          [key]: variable,
        };
      }, {}),
    [variables]
  );

  const filteredVariables = useMemo(
    () => variables.filter((variable) => Boolean(variable.key)),
    [variables]
  );

  const value = useMemo(
    () => ({ variables, mappedVariables, filteredVariables }),
    [filteredVariables, mappedVariables, variables]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
