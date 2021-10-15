import { PlayWrightScrapperRunner } from '../PlayWrightScrapperRunner';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import { ScrapperAction, ScrapperRun } from '@scrapper-gate/shared/schema';

export async function setupConfirmationTest(
  scrapperRun: ScrapperRun,
  runner: PlayWrightScrapperRunner
) {
  await runner.Click({
    scrapperRun,
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
    scrapperRun,
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
