import joi from 'joi';
import { supportsVariables } from './supportsVariables';

const TestSchema = joi.object({
  url: supportsVariables({
    schema: joi.string().required(),
    onIncludesVariableKey: () => joi.string().required(),
    onNotIncludesVariableKey: () => joi.string().uri().required(),
  }),
});

describe('Supports variables', () => {
  it('should validate empty object', () => {
    const obj = {};

    const result = TestSchema.validate(obj);

    expect(result.error).toBeTruthy();
  });

  it.each(['{{Test}}', 'Hello, {{World}}'])(
    'should trigger validation if contains variable key',
    (value) => {
      const obj = {
        url: value,
      };

      const result = TestSchema.validate(obj);

      expect(result.error).toBeFalsy();
    }
  );

  it('should trigger validation if does not contain variable key', () => {
    const obj = {
      url: 'Invalid url',
    };

    const result = TestSchema.validate(obj);

    expect(result.error).toBeTruthy();
  });
});
