export const isHtmlAttribute = (value: unknown) => {
  return typeof value === 'string' && !value.includes(' ');
};
