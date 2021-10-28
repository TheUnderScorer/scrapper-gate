import { first } from '@scrapper-gate/shared/common';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { getPotentialVariablesForStep } from './getPotentialVariablesForStep';

describe('Get potential variables for step', () => {
  it('should return correct variables', async () => {
    const firstStep = await createMockScrapperStep({});
    const secondStep = await createMockScrapperStep({});

    firstStep.key = 'test';
    firstStep.action = faker.random.arrayElement([
      ScrapperAction.ReadText,
      ScrapperAction.ReadAttribute,
    ]);

    firstStep.nextStep = secondStep;

    const result = getPotentialVariablesForStep(secondStep, [
      secondStep,
      firstStep,
    ]);

    expect(result).toHaveLength(1);

    const variable = first(result);

    expect(variable.key).toEqual(firstStep.key);
  });
});
