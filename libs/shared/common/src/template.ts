export enum TemplateType {
  Braces = 'Braces',
  Colon = 'Colon',
}

export const applyVariablesToText = (
  text: string,
  variables: Record<string, string | number | boolean>,
  type: TemplateType = TemplateType.Braces
) => {
  return Object.entries(variables).reduce((currentText, [key, value]) => {
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

const getRegexByType = (value: unknown, type: TemplateType) => {
  switch (type) {
    case TemplateType.Braces:
      return new RegExp(`{{${value}}}`, 'g');

    case TemplateType.Colon:
      return new RegExp(`:${value}`, 'g');

    default:
      throw new TypeError(`Invalid template type: ${type}`);
  }
};
