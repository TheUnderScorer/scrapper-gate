import { VariableScope } from '@scrapper-gate/shared/schema';
import { variablesToConstDeclaration } from './codeUtils';
import { createVariable } from './createVariable';

describe('Variable code utils', () => {
  it('should map variables to const definitions', () => {
    const variables = [
      createVariable({
        key: 'test',
        scope: VariableScope.Scrapper,
      }),
      createVariable({
        key: 'test2',
        scope: VariableScope.Scrapper,
      }),
    ];

    const declaration = variablesToConstDeclaration(variables);

    expect(declaration).toMatchInlineSnapshot(`
      "
          declare const variables: {
            'test': Variable;
      'test2': Variable
          };
        "
    `);
  });
});
