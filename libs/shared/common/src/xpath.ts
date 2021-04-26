import { Selector } from '@scrapper-gate/shared/schema';

export const xpathResultToArray = (result: XPathResult) => {
  const elements: HTMLElement[] = [];

  let next = result.iterateNext();

  while (next) {
    elements.push(next as HTMLElement);

    next = result.iterateNext();
  }

  return elements;
};

export const selectorToXpathExpression = ({ value }: Selector) =>
  `//*[text()[contains(., '${value}')]]`;

export const mapSelectorsToXpathExpression = (
  textContentSelectors: Selector[]
) =>
  textContentSelectors
    .map((selector) => selectorToXpathExpression(selector))
    .join('|');
