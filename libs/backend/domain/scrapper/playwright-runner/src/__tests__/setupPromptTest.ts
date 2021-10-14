import { PlayWrightScrapperRunner } from '../PlayWrightScrapperRunner';
import { createMockScrapperStep } from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  ScrapperAction,
  ScrapperDialogBehaviour,
  ScrapperRun,
} from '@scrapper-gate/shared/schema';

interface SetupPromptTestParams {
  scrapperRun: ScrapperRun;
  dialogBehaviour?: ScrapperDialogBehaviour;
  createRunner: () => Promise<PlayWrightScrapperRunner>;
}

export async function setupPromptTest({
  scrapperRun,
  dialogBehaviour = ScrapperDialogBehaviour.AlwaysConfirm,
  createRunner,
}: SetupPromptTestParams) {
  const promptText = 'Test prompt text';

  scrapperRun.runSettings = {
    dialogBehaviour,
    promptText,
  };

  const runner = await createRunner();

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
