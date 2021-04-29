import { trimEndChar } from './text';

describe('trimEndChar', () => {
  it.each([
    ['Hello!', '!', 'Hello'],
    ['Sup', '!', 'Sup'],
  ])(
    'should remove last character if it exists',
    (text, char, expectedText) => {
      expect(trimEndChar(text, char)).toEqual(expectedText);
    }
  );
});
