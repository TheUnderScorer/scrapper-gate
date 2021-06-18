import { Selector, SelectorType } from '@scrapper-gate/shared/schema';
import {
  mapSelectorsToXpathExpression,
  selectorToXpathExpression,
  xpathResultToArray,
} from './xpath';

export interface SelectorAggregate extends Selector {
  elements: HTMLElement[];
}

export const handleSelector = (
  selector: Selector,
  document: Document
): HTMLElement[] => {
  try {
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
  } catch {
    return [];
  }
};

export const getSelectorWithElementsAggregate = (
  selectors: Selector[],
  document: Document,
  ignoredElementsContainer?: HTMLElement
): SelectorAggregate[] =>
  selectors.map((selector) => ({
    ...selector,
    elements: handleSelector(selector, document).filter(
      (element) =>
        !ignoredElementsContainer || !ignoredElementsContainer.contains(element)
    ),
  }));

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
