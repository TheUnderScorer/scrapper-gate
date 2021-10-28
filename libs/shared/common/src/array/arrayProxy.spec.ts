import { makeArrayProxy } from './arrayProxy';

describe('Array proxy', () => {
  it('should cast all non-array elements to array', () => {
    const obj = {
      value1: 'test',
      value2: 123,
      arrayValue: [123],
      nested: {
        nestedValue1: 'test',
        nestedArray: [1],
      },
    };

    const result = makeArrayProxy(obj);

    expect(result).toEqual({
      value1: ['test'],
      value2: [123],
      arrayValue: [123],
      nested: [
        {
          nestedValue1: ['test'],
          nestedArray: [1],
        },
      ],
    });
  });

  it('should support array changes', () => {
    const obj = {
      value: 1,
    };

    const result = makeArrayProxy(obj);

    result.value.push(2);

    expect(result.value).toEqual([1, 2]);
  });
});
