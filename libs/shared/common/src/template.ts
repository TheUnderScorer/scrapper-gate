export enum TemplateType {
  Braces = 'Braces',
  Dot = 'Dot',
}

export const applyVariablesToText = (
  text: string,
  variables: Record<string, string | number | boolean>,
  type: TemplateType = TemplateType.Braces
) => {
  return Object.entries(variables).reduce((currentText, [key, value]) => {
    const regExp = getRegexByType(key, type);

    return currentText.replace(regExp, value.toString());
  }, text);
};

const getRegexByType = (value: unknown, type: TemplateType) => {
  switch (type) {
    case TemplateType.Braces:
      return new RegExp(`{{${value}}}`, 'g');

    case TemplateType.Dot:
      return new RegExp(`:${value}`, 'g');

    default:
      throw new TypeError(`Invalid template type: ${type}`);
  }
};
