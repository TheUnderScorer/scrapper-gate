import * as jf from 'joiful';
import { validateAsClass } from 'joiful';
import { supportsVariables } from './supportsVariables';

class Test {
  @supportsVariables({
    baseSchema: jf.any(),
    onIncludesVariableKey: (joi) => {
      return joi.string().required();
    },
    onNotIncludesVariableKey: (joi) => {
      return joi.string().uri().required();
    },
  })
  url: any;
}

describe('Supports variables', () => {
  it('should validate empty string', () => {
    const obj = {};

    const result = validateAsClass(obj, Test, {
      allowUnknown: false,
    });

    expect(result.error).toBeTruthy();
  });

  it.each(['{{Test}}', 'Hello, {{World}}'])(
    'should trigger validation if contains variable key',
    (value) => {
      const obj = {
        url: value,
      };

      const result = validateAsClass(obj, Test);

      expect(result.error).toBeNull();
    }
  );

  it('should trigger validation if does not contain variable key', () => {
    const obj = {
      url: 'Invalid url',
    };

    const result = validateAsClass(obj, Test);

    expect(result.error).not.toBeNull();
  });
});
