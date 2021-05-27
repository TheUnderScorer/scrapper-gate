import {
  mapSelectorsToXpathExpression,
  selectorToXpathExpression,
} from './xpath';
import { Selector } from '@scrapper-gate/shared/schema';

describe('selectorToXpathExpression', () => {
  it('should return valid xpath expression', () => {
    const selector: Selector = {
      value: 'Some text content',
    };

    expect(selectorToXpathExpression(selector)).toMatchInlineSnapshot(
      `"//*[text()[contains(., 'Some text content')]]"`
    );
  });
});

describe('mapSelectorsToXpathExpression', () => {
  it('should map selectors to valid xpath expression', () => {
    const selectors: Selector[] = [
      {
        value: 'Some text content',
      },
      {
        value: 'Another text content',
      },
    ];

    expect(mapSelectorsToXpathExpression(selectors)).toMatchInlineSnapshot(
      `"//*[text()[contains(., 'Some text content')]]|//*[text()[contains(., 'Another text content')]]"`
    );
  });
});
