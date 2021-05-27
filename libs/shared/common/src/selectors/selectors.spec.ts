import { getElementsBySelectors } from './selectors';
import { Selector, SelectorType } from '@scrapper-gate/shared/schema';

describe('getElementsBySelectors', () => {
  it('should return elements by selectors', () => {
    const selectors: Selector[] = [
      {
        value: '.test',
        type: SelectorType.Selector,
      },
      {
        type: SelectorType.TextContent,
        value: 'Some text content',
      },
      {
        value: '.another',
      },
    ];

    const firstItem = document.createElement('div');
    const secondItem = document.createElement('span');
    const thirdItem = document.createElement('a');

    firstItem.classList.add('test');
    secondItem.textContent = 'Some text content, lorem ipsum';
    thirdItem.classList.add('another');

    document.body.appendChild(firstItem);
    document.body.appendChild(secondItem);
    document.body.appendChild(thirdItem);

    const result = getElementsBySelectors(selectors, document);
    expect(result).toHaveLength(3);
    expect(result).toContain(firstItem);
    expect(result).toContain(secondItem);
    expect(result).toContain(thirdItem);
  });
});
