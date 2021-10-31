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
  filter?: (variables: Variable[]) => Variable[];
  variables: Variable[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const defaultValue: any[] = [];

export const VariablesContext = createContext<VariablesProviderContext>({
  variables: defaultValue,
  mappedVariables: {},
  filteredVariables: defaultValue,
});

export const useVariablesContext = () => useContext(VariablesContext);

export const useVariablesContextSelector = <Value extends unknown>(
  selector: (ctx: VariablesProviderContext) => Value
) => useContextSelector(VariablesContext, selector);

export const VariablesProvider = ({
  filter,
  children,
  variables,
}: PropsWithChildren<VariableProviderProps>) => {
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
    }),
    [filteredVariables, mappedVariables, variablesWithKeys]
  );

  return (
    <VariablesContext.Provider value={value}>
      {children}
    </VariablesContext.Provider>
  );
};
