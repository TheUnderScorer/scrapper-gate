import { castAsArray } from './array';

describe('castAsArray', () => {
  it('should cast non-array item as array', () => {
    expect(castAsArray('hello')).toEqual(['hello']);
  });
});
