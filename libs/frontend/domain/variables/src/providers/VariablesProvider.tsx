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

export interface VariablesProviderContext
  extends Pick<VariableProviderProps, 'name'> {
  variables: Variable[];
  // Record with mapped keys and matching variable. Key is formatted with template brackets, ex. {{My Variable}}: Variable
  mappedVariables: Record<string, Variable>;

  // Filtered variable, here every variable must have a key
  filteredVariables: Variable[];
}

export interface VariableProviderProps {
  // Name of form field under which variables are stored
  name: string;
  filter?: (variables: Variable[]) => Variable[];
}

const defaultValue = [];

const Context = createContext<VariablesProviderContext>({
  variables: defaultValue,
  mappedVariables: {},
  filteredVariables: defaultValue,
  name: '',
});

export const useVariablesContext = () => useContext(Context);

export const useVariablesContextSelector = <Value extends unknown>(
  selector: (ctx: VariablesProviderContext) => Value
) => useContextSelector(Context, selector);

export const VariablesProvider = ({
  name,
  children,
  filter,
}: PropsWithChildren<VariableProviderProps>) => {
  const variables = useFormFieldValue<Variable[]>(name, defaultValue);
  const filteredVariables = useMemo(() => {
    const variablesArray = Array.isArray(variables) ? variables : defaultValue;

    return filter ? filter(variablesArray) : variablesArray;
  }, [filter, variables]);

  const mappedVariables = useMemo(
    () =>
      filteredVariables.reduce((acc, variable) => {
        const key = getTextVariableTemplate(variable.key, TemplateType.Braces);

        return {
          ...acc,
          [key]: variable,
        };
      }, {}),
    [filteredVariables]
  );

  const variablesWithKeys = useMemo(
    () => filteredVariables.filter((variable) => Boolean(variable.key)),
    [filteredVariables]
  );

  const value = useMemo(
    () => ({
      variables: filteredVariables,
      mappedVariables,
      filteredVariables: variablesWithKeys,
      name,
    }),
    [filteredVariables, mappedVariables, name, variablesWithKeys]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
