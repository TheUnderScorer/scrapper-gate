import joi from 'joi';
import { validate } from './validate';
import { ValidationError } from './ValidationError';

const schema = joi.object({
  intValue: joi.number().required().integer(),
  email: joi.string().email().optional(),
});

describe('validate', () => {
  it('should throw error if validation fails', () => {
    const input = {};

    expect(() => validate(input, schema)).toThrow(ValidationError);
  });

  it('should not throw if validation succeeds', () => {
    const input = {
      intValue: 5,
      email: 'test@test.com',
    };

    expect(() => validate(input, schema)).not.toThrow();
  });
});
