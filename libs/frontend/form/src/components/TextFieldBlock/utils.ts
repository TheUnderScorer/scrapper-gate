import { matchAllIndexes } from '@scrapper-gate/shared/common';
import { ContentBlock } from 'draft-js';

//^{[a-zA-Z]*
export const regexDecoratorStrategy = (regex: RegExp) => (
  block: ContentBlock,
  callback: (start: number, end: number) => void
) => {
  const text = block.getText();

  const matches = matchAllIndexes(text, regex);

  matches.forEach(([startIndex, endIndex]) => {
    callback(startIndex, endIndex);
  });
};
