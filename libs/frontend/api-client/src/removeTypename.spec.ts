import { removeTypename } from './removeTypename';

describe('Remove typename', () => {
  it('should remove typename', () => {
    const obj = {
      a: 1,
      b: 2,
      arr: [
        {
          c: 1,
          __typename: 'array',
        },
      ],
      __typename: 'obj',
    };

    const result = removeTypename(obj);

    expect(result).toEqual({
      a: 1,
      b: 2,
      arr: [
        {
          c: 1,
        },
      ],
    });
  });
});