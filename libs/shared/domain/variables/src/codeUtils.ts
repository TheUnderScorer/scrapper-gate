import { ExcludeFalsy } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { getVariableValue } from './getVariableValue';

// Interface for variable that is used during code execution (ex. in scrapper "RunJavascript" step)
export interface VariableTsCodeType {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
}

export const variableTypeDef = `
/**
 * @typedef {Object} Variable - Defines scrapper variable
 * @property {string} key - a unique variable key
 * @property {any} value - variable value
 */
`;

export const variablesToCodeTsType = (
  variables: Variable[]
): VariableTsCodeType[] =>
  variables
    .filter((v) => v.key)
    .map((v) => ({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      key: v.key!,
      value: getVariableValue({ variable: v }),
    }));

export const createInjectableIntoCodeVariables = (variables: Variable[]) => {
  const tsTypeVariables = variablesToCodeTsType(variables);

  return tsTypeVariables.reduce((acc, tsType) => {
    return {
      ...acc,
      [tsType.key]: tsType,
    };
  }, {});
};

export const variablesToConstDeclaration = (variables: Variable[]) => {
  const keys = variables
    .map((v) => v.key)
    .filter(ExcludeFalsy)
    .reduce<string[]>((acc, key) => {
      return [...acc, `'${key}': Variable`];
    }, []);

  return `
    declare const variables: {
      ${keys.join(';\n')}
    };
  `;
};
