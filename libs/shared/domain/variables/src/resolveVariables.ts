import {
  applyVariablesToText,
  TemplateType,
  TemplateVariables,
} from '@scrapper-gate/shared/common';
import { getVariableValue } from './getVariableValue';
import { ResolvableVariable } from './types';

export type ResolveVariablesResult<T> = T extends string ? string : T;

// TODO Add option to limit which fields should be resolved (if given object)
export const resolveVariables = <T = unknown>(
  target: T,
  variables: ResolvableVariable[]
): ResolveVariablesResult<T> => {
  const mappedVariables = variables.reduce((acc, variable) => {
    return {
      ...acc,
      [variable.key]: getVariableValue(variable),
    };
  }, {});

  return resolveMappedVariables(target, mappedVariables);
};

const resolveMappedVariables = <T = unknown>(
  target: T,
  variables: TemplateVariables
): ResolveVariablesResult<T> => {
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
) => {
  return array.map((value) =>
    resolveMappedVariables(value, variables)
  ) as ResolveVariablesResult<T>;
};

const replaceVariablesInObj = <T>(obj: T, variables: TemplateVariables) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: resolveMappedVariables(value, variables),
    };
  }, obj);
};

const replaceVariablesInText = (text: string, variables: TemplateVariables) => {
  return applyVariablesToText(text, variables, TemplateType.Braces);
};
