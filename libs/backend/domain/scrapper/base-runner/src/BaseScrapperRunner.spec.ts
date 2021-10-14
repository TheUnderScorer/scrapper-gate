import {
  createMockScrapperRun,
  createMockScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
  ScrapperRun,
  ScrapperRunSettings,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { BaseScrapperRunner } from './BaseScrapperRunner';

class Runner extends BaseScrapperRunner {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(run: ScrapperRun) {
    super(run);
  }

  get currentRunSettings() {
    return this.runSettings;
  }
}

describe('BaseScrapperRunner', () => {
  const run = createMockScrapperRun([]);

  run.runSettings = {
    initialUrl: faker.internet.url(),
  };

  it('should change run settings', async () => {
    const runner = new Runner(run);

    const newRunSettings: ScrapperRunSettings = {
      dialogBehaviour: ScrapperDialogBehaviour.AlwaysReject,
      initialUrl: faker.internet.url(),
      noElementsFoundBehavior: ScrapperNoElementsFoundBehavior.Continue,
      promptText: 'Test',
    };

    runner.ChangeRunSettings({
      step: {
        ...(await createMockScrapperStep({})),
        newRunSettings,
      },
      scrapperRun: run,
      variables: [],
    });

    expect(runner.currentRunSettings).toEqual({
      initialUrl: run.runSettings?.initialUrl,
      ...newRunSettings,
    });
  });
});
