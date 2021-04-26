import { prefix } from '@scrapper-gate/shared/common';

export const removeHighlight = (additionalClassName?: string) => {
  const selector = additionalClassName
    ? `.${additionalClassName}.${prefix('highlight')}`
    : `.${prefix('highlight')}`;
  const elements = document.querySelectorAll(selector);

  if (elements.length) {
    elements.forEach((el) => {
      el.classList.remove(prefix('highlight'));
    });
  }
};

export const toggleHighlight = (
  active: boolean,
  additionalClassName?: string
) => {
  const selector = additionalClassName
    ? `.${additionalClassName}.${prefix('highlight')}`
    : `.${prefix('highlight')}`;
  const elements = document.querySelectorAll(selector);

  if (elements.length) {
    elements.forEach((el) => {
      el.classList[active ? 'remove' : 'add']('hidden');
    });
  }
};

export const addHighlight = (
  elements: Element[],
  additionalClassName?: string
) => {
  elements.forEach((el) => {
    el.classList.add(prefix('highlight'));

    if (additionalClassName) {
      el.classList.add(additionalClassName);
    }
  });
};
