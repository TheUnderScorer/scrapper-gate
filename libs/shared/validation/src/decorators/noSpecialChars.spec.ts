import { BaseSchema } from '../BaseSchema';
import { validateAsClass } from 'joiful';
import { noSpecialChars } from './noSpecialChars';

class Test extends BaseSchema<Test> {
  @noSpecialChars({ max: 50 })
  value: string;
}

class TestVariable extends BaseSchema<TestVariable> {
  @noSpecialChars({ max: 50, supportsVariables: true })
  value: string;
}

describe('No special chars', () => {
  it.each(['test @@', 'test ', '*#@%', 'test.*'])(
    'should fail if value contains special chars',
    async (value) => {
      const result = await validateAsClass({ value }, Test);

      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual(
        '"value" failed custom validation because Space and special characters (@#$%^&*()/><|[]) are not allowed.'
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
    const result = await validateAsClass({ value }, TestVariable);

    if (shouldThrow) {
      expect(result.error).toBeDefined();
      expect(result.error?.message).toEqual(
        '"value" failed custom validation because Space and special characters (@#$%^&*()/><|[]) are not allowed.'
      );
    } else {
      expect(result.error).toBeNull();
    }
  });
});
