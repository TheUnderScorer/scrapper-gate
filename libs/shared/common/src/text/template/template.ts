import { Perhaps } from '../../types';

export enum TemplateType {
  Braces = 'Braces',
  Colon = 'Colon',
}

export type TemplateVariables = Record<
  string,
  Perhaps<string | number | boolean>
>;

export interface ApplyVariablesToTextParams {
  text: string;
  variables: TemplateVariables;
  type?: TemplateType;
  arraySeparator?: string;
}

export const applyVariablesToText = ({
  text,
  variables,
  type = TemplateType.Braces,
  arraySeparator = ',',
}: ApplyVariablesToTextParams) => {
  return Object.entries(variables).reduce((currentText, [key, value]) => {
    if (!value || !key) {
      return currentText;
    }

    const regExp = getTemplateRegexByType(key, type);

    return currentText.replace(regExp, convertValue(value, { arraySeparator }));
  }, text);
};

const convertValue = (
  value: unknown,
  { arraySeparator = ',' }: Pick<ApplyVariablesToTextParams, 'arraySeparator'>
) => {
  switch (typeof value) {
    case 'boolean':
      return value ? '1' : '0';

    case 'function':
    case 'number':
    case 'string':
      return value.toString();

    case 'object':
      if (Array.isArray(value)) {
        return value.join(arraySeparator);
      }

      return JSON.stringify(value);

    default:
      return '';
  }
};

export const getTemplateRegexByType = (key: unknown, type: TemplateType) =>
  new RegExp(getTextVariableTemplate(key, type), 'g');

export const getTextVariableTemplate = (key: unknown, type: TemplateType) => {
  switch (type) {
    case TemplateType.Braces:
      return `{{${key}}}`;

    case TemplateType.Colon:
      return `:${key}`;

    default:
      throw new TypeError(`Invalid template type: ${type}`);
  }
};
