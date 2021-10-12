import { PlayWrightScrapperRunner } from '@scrapper-gate/backend/domain/scrapper/playwright-runner';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  ScrapperAction,
  ScrapperDialogBehaviour,
  ScrapperRun,
} from '@scrapper-gate/shared/schema';

export async function setupPromptTest(
  runner: PlayWrightScrapperRunner,
  scrapperRun: ScrapperRun,
  dialogBehaviour: ScrapperDialogBehaviour = ScrapperDialogBehaviour.AlwaysConfirm
) {
  const promptText = 'Test prompt text';

  scrapperRun.runSettings = {
    dialogBehaviour,
    promptText,
  };

  await runner.initialize();

  await runner.Click({
    step: {
      ...(await createMockScrapperStep({})),
      action: ScrapperAction.Click,
      url: 'http://localhost:8080/alert/index.html',
      useUrlFromPreviousStep: false,
      allSelectors: [
        {
          value: '#view_prompt',
        },
      ],
    },
    scrapperRun,
    variables: [],
  });

  const { values } = await runner.ReadText({
    scrapperRun,
    variables: [],
    step: {
      ...(await createMockScrapperStep({})),
      url: '',
      useUrlFromPreviousStep: true,
      action: ScrapperAction.ReadText,
      allSelectors: [
        {
          value: '.prompt-content',
        },
      ],
    },
  });

  return { promptText, values };
}
