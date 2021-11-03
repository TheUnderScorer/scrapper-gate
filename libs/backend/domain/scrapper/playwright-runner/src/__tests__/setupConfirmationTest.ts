import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { PlayWrightScrapperRunner } from '../PlayWrightScrapperRunner';

export async function setupConfirmationTest(runner: PlayWrightScrapperRunner) {
  await runner.Click({
    variables: [],
    step: {
      ...(await createMockScrapperStep({})),
      url: 'http://localhost:8080/alert/index.html',
      useUrlFromPreviousStep: false,
      allSelectors: [
        {
          value: '#view_confirm',
        },
      ],
    },
  });

  const { values } = await runner.ReadText({
    variables: [],
    step: {
      ...(await createMockScrapperStep({})),
      useUrlFromPreviousStep: true,
      action: ScrapperAction.ReadText,
      allSelectors: [
        {
          value: '.confirm-result',
        },
      ],
    },
  });

  return values;
}
