const notEditableInputTypes = ['checkbox', 'radio'];
const supportedTagTypes = ['input', 'textarea'];

export const isElementEditable = (element: HTMLElement) => {
  if (supportedTagTypes.includes(element.tagName.toLowerCase())) {
    return !notEditableInputTypes.includes((element as HTMLInputElement).type);
  }

  return element.contentEditable === 'true';
};
