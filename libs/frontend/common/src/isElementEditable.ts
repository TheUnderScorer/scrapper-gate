const notEditableInputTypes = ['checkbox', 'radio'];

export const isElementEditable = (element: HTMLElement) => {
  if (element.tagName === 'INPUT') {
    return !notEditableInputTypes.includes((element as HTMLInputElement).type);
  }

  return element.contentEditable === 'true';
};
