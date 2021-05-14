import baseUniqueSelector from 'unique-selector';
import { prefix } from '@scrapper-gate/shared/common';

export interface UniqueSelectorOptions {
  ignoredClassNames?: string[];
  rootSelector?: string;
}

export const uniqueSelector = (
  element: Element,
  { ignoredClassNames = [], rootSelector }: UniqueSelectorOptions = {}
) => {
  const excludeRegex = ignoredClassNames.length
    ? new RegExp(`${prefix('highlight')}|${ignoredClassNames.join('|')}`)
    : new RegExp(prefix('highlight'));

  const result = baseUniqueSelector(element, {
    excludeRegex,
  });

  return rootSelector ? `${rootSelector} ${result}` : result;
};

export const makeUniqueSelector = (options: UniqueSelectorOptions = {}) => (
  element: Element
) => uniqueSelector(element, options);

export const addOrRemoveSelectorFromSelectors = (
  selectors: string,
  selectorToAdd: string
) => {
  let newSelectors = selectors;

  if (newSelectors.includes(selectorToAdd)) {
    newSelectors = newSelectors
      .split(',')
      .filter((val) => val !== selectorToAdd)
      .join(',');
  } else {
    newSelectors = newSelectors
      ? `${newSelectors},${selectorToAdd}`
      : selectorToAdd;
  }

  return newSelectors;
};

export type UniqueSelector = ReturnType<typeof makeUniqueSelector>;
