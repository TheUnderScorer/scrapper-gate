import {
  applyVariablesToText,
  DateFormat,
  TemplateType,
  TemplateVariables,
} from '@scrapper-gate/shared/common';
import { getVariableValue } from './getVariableValue';
import { ResolvableVariable } from './types';

export type ResolveVariablesResult<T> = T extends string ? string : T;

interface ResolveVariablesParams<T = unknown> {
  target: T;
  variables: ResolvableVariable[];
  dateFormat?: string;
  arraySeparator?: string;
}

// TODO Add option to limit which fields should be resolved (if given object)
export const resolveVariables = <T = unknown>({
  target,
  variables,
  dateFormat = DateFormat.Date,
}: ResolveVariablesParams<T>): ResolveVariablesResult<T> => {
  if (!variables.length || !target) {
    return target as ResolveVariablesResult<T>;
  }

  const mappedVariables = variables
    .filter((variable) => Boolean(variable.key))
    .reduce(
      (acc, variable) => ({
        ...acc,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        [variable.key!]: getVariableValue({
          variable: variable,
          dateFormat: dateFormat,
        }),
      }),
      {}
    );

  return resolveMappedVariables(target, mappedVariables);
};

const resolveMappedVariables = <T = unknown>(
  target: T,
  variables: TemplateVariables
): ResolveVariablesResult<T> => {
  if (!target) {
    return target as ResolveVariablesResult<T>;
  }

  switch (typeof target) {
    case 'string':
      return replaceVariablesInText(
        target,
        variables
      ) as ResolveVariablesResult<T>;

    case 'object':
      if (Array.isArray(target)) {
        return replaceVariablesInArray(target, variables);
      }

      return replaceVariablesInObj(
        target,
        variables
      ) as ResolveVariablesResult<T>;

    default:
      return target as ResolveVariablesResult<T>;
  }
};

const replaceVariablesInArray = <T extends unknown[]>(
  array: T,
  variables: TemplateVariables
) =>
  array.map((value) =>
    resolveMappedVariables(value, variables)
  ) as ResolveVariablesResult<T>;

const replaceVariablesInObj = <T>(obj: T, variables: TemplateVariables) =>
  Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: resolveMappedVariables(value, variables),
    }),
    obj
  );

const replaceVariablesInText = (text: string, variables: TemplateVariables) =>
  applyVariablesToText({
    text,
    variables,
    type: TemplateType.Braces,
  });
