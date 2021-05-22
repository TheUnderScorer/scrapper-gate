export enum TemplateType {
  Braces = 'Braces',
  Colon = 'Colon',
}

export type TemplateVariables = Record<string, string | number | boolean>;

export const applyVariablesToText = (
  text: string,
  variables: TemplateVariables,
  type: TemplateType = TemplateType.Braces
) => {
  return Object.entries(variables).reduce((currentText, [key, value]) => {
    if (!value || !key) {
      return currentText;
    }

    const regExp = getRegexByType(key, type);

    return currentText.replace(regExp, convertValue(value));
  }, text);
};

const convertValue = (value: unknown) => {
  switch (typeof value) {
    case 'boolean':
      return value ? '1' : '0';

    default:
      return value.toString();
  }
};

const getRegexByType = (key: unknown, type: TemplateType) =>
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
