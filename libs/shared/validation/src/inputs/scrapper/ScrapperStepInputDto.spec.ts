import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { VariableScope } from '@scrapper-gate/shared/schema';
import { ScrapperStepInputDto } from './ScrapperStepInputDto';
import { validateAsClass } from 'joiful';
import { validationMessages } from '../../validationMessages';

describe('ScrapperStepInputDto', () => {
  it('should validate key using variables as well', () => {
    const input = {
      key: 'test',
    };

    const variable = createVariable({
      key: 'test',
      scope: VariableScope.Scrapper,
    });

    const result = validateAsClass(input, ScrapperStepInputDto, {
      context: {
        variables: [variable],
        steps: [],
      },
      messages: validationMessages,
    });

    expect(result.error).toBeTruthy();
    expect(result.error?.message).toEqual('This field value must be unique.');
  });
});
