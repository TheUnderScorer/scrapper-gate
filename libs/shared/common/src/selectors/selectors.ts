import {
  mapSelectorsToXpathExpression,
  selectorToXpathExpression,
  xpathResultToArray,
} from './xpath';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';

export interface SelectorAggregate extends Selector {
  elements: HTMLElement[];
}

export const handleSelector = (
  selector: Selector,
  document: Document
): HTMLElement[] => {
  switch (selector.type) {
    case SelectorType.TextContent:
      return xpathResultToArray(
        document.evaluate(
          selectorToXpathExpression(selector),
          document,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE
        )
      );

    case SelectorType.Selector:
    default:
      return Array.from(
        document.querySelectorAll(selector.value)
      ) as HTMLElement[];
  }
};

export const getSelectorWithElementsAggregate = (
  selectors: Selector[],
  document: Document,
  ignoredElementsContainer?: HTMLElement
): SelectorAggregate[] => {
  const result = selectors.map((selector) => ({
    ...selector,
    elements: handleSelector(selector, document),
  }));

  if (!ignoredElementsContainer) {
    return result;
  }

  return result.map((item) => ({
    ...item,
    elements: item.elements.filter(
      (element) => !ignoredElementsContainer.contains(element)
    ),
  }));
};

export const getElementsBySelectors = (
  selectors: Selector[],
  document: Document
): HTMLElement[] => {
  const querySelectors = selectors
    .filter(
      (selector) => selector.type === SelectorType.Selector || !selector.type
    )
    .map(({ value }) => value)
    .join(',');

  const textContentSelectors = selectors.filter(
    (selector) => selector.type === SelectorType.TextContent
  );

  const xpathExpression = textContentSelectors.length
    ? mapSelectorsToXpathExpression(textContentSelectors)
    : null;

  const htmlElementsFromSelector = querySelectors.length
    ? (Array.from(document.querySelectorAll(querySelectors)) as HTMLElement[])
    : [];

  const htmlElementsFromXpath = xpathExpression
    ? xpathResultToArray(
        document.evaluate(
          xpathExpression,
          document,
          null,
          XPathResult.ORDERED_NODE_ITERATOR_TYPE
        )
      )
    : [];

  return [...htmlElementsFromSelector, ...htmlElementsFromXpath];
};
