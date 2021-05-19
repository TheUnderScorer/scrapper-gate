import { resolveVariables } from './resolveVariables';
import { ResolvableVariable } from './types';

const variables: ResolvableVariable[] = [
  {
    key: 'value',
    value: '123',
  },
  {
    key: 'anotherValue',
    value: '345',
  },
  {
    key: 'unused',
  },
];

describe('Resolve variables', () => {
  it('should resolve variable for text', () => {
    const result = resolveVariables(
      'Test text {{value}} {{value}} {{anotherValue}}',
      variables
    );

    expect(result).toEqual('Test text 123 123 345');
  });

  it('should resolve variable for object', () => {
    const obj = {
      prop: '{{value}}',
      anotherProp: '{{anotherValue}}',
      test: true,
      nested: {
        nestedValue: '{{value}}',
      },
    };

    const result = resolveVariables(obj, variables);

    expect(result.prop).toEqual('123');
    expect(result.nested.nestedValue).toEqual('123');
    expect(result.anotherProp).toEqual('345');
    expect(result.test).toEqual(true);
  });

  it('should resolve variable for array', () => {
    const array = [
      '{{value}}',
      {
        prop: '{{anotherValue}}',
      },
      ['{{anotherValue}}'],
    ];

    const result = resolveVariables(array, variables);

    expect(result).toEqual([
      '123',
      {
        prop: '345',
      },
      ['345'],
    ]);
  });
});
