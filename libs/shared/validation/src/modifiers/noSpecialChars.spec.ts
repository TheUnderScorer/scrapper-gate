import joi from 'joi';
import { pipe } from 'remeda';
import { validationMessages } from '../validationMessages';
import { noSpecialChars } from './noSpecialChars';

const TestSchema = joi.object({
  value: pipe(joi.string().max(50), (schema) => noSpecialChars({ schema })),
});

const TestSchemaWithVariables = joi.object({
  value: pipe(joi.string().max(50), (schema) =>
    noSpecialChars({ schema, supportsVariables: true })
  ),
});

describe('No special chars', () => {
  it.each(['test @@', 'test ', '*#@%', 'test.*'])(
    'should fail if value contains special chars',
    async (value) => {
      const result = await TestSchema.validate(
        {
          value,
        },
        {
          messages: validationMessages,
        }
      );

      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual(
        'Space and special characters (@#$%^&*()/><|[]) are not allowed.'
      );
    }
  );

  it.each<[value: string, shouldThrow: boolean]>([
    ['test{{Val}}', false],
    ['test{{Val}', true],
    ['test{Val}}', true],
    ['test{{Val}} ', true],
    ['test{{Val}}*', true],
    ['test{{Val}}@', true],
  ])('should support variable tags', async (value, shouldThrow) => {
    const result = await TestSchemaWithVariables.validate(
      { value },
      {
        messages: validationMessages,
      }
    );

    if (shouldThrow) {
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual(
        'Space and special characters (@#$%^&*()/><|[]) are not allowed.'
      );
    } else {
      expect(result.error).toBeFalsy();
    }
  });
});
