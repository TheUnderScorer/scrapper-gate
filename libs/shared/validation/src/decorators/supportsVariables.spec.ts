import { validateAsClass } from 'joiful';
import { supportsVariables } from './supportsVariables';
import * as jf from 'joiful';

class Test {
  @supportsVariables({
    baseSchema: jf.any(),
    onIncludesVariableKey: (joi) => {
      return joi.string();
    },
    onNotIncludesVariableKey: (joi) => {
      return joi.string().uri();
    },
  })
  url?: unknown;
}

describe('Supports variables', () => {
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
