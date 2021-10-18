import { UserModel } from '@scrapper-gate/backend/domain/user';
import { createMockUser } from '@scrapper-gate/shared/domain/user/mocks';
import {
  MouseButton,
  RunState,
  ScrapperAction,
  ScrapperType,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import '../../../../../../typings/global';
import { ScrapperModel } from './Scrapper.model';
import { ScrapperRunModel } from './ScrapperRun.model';
import { ScrapperRunStepResultModel } from './ScrapperRunStepResult.model';
import { ScrapperRunStepValueModel } from './ScrapperRunStepValue.model';
import { ScrapperStepModel } from './ScrapperStep.model';

describe('ScrapperModel', () => {
  let user: UserModel;

  beforeEach(async () => {
    user = UserModel.create(createMockUser());

    await global.connection.getRepository(UserModel).save(user);
  });

  it('should persist in DB without steps', async () => {
    const repository = global.connection.getRepository(ScrapperModel);

    const scrapper = ScrapperModel.create({
      name: faker.random.word(),
      createdBy: user,
      type: ScrapperType.RealBrowser,
    });

    await repository.save(scrapper);

    const foundScrapper = await repository.findOneOrFail(scrapper.id, {
      relations: ['createdBy'],
    });

    expect(foundScrapper).toEqual(scrapper);
  });

  it('should persist in DB with steps', async () => {
    const repository = global.connection.getRepository(ScrapperModel);

    const scrapper = ScrapperModel.create({
      name: faker.random.word(),
      createdBy: user,
      type: ScrapperType.RealBrowser,
      steps: [
        ScrapperStepModel.create({
          action: ScrapperAction.Click,
          mouseButton: MouseButton.Right,
          url: faker.internet.url(),
          conditionalRules: [],
        }),
      ],
    });

    await repository.save(scrapper);

    const foundScrapper = await repository.findOneOrFail(scrapper.id, {
      relations: ['createdBy', 'steps'],
    });

    expect(foundScrapper).toEqual(scrapper);
  });

  it('should persist in DB with results', async () => {
    const repository = global.connection.getRepository(ScrapperModel);

    const step = ScrapperStepModel.create({
      action: ScrapperAction.Click,
      mouseButton: MouseButton.Right,
      url: faker.internet.url(),
      conditionalRules: [],
    });

    const stepJson = step.toJSON();

    const scrapper = ScrapperModel.create({
      name: faker.random.word(),
      createdBy: user,
      steps: [step],
      type: ScrapperType.RealBrowser,
      runs: [
        ScrapperRunModel.create({
          steps: [stepJson],
          state: RunState.Pending,
          key: 'test',
          index: 0,
          results: [
            ScrapperRunStepResultModel.create({
              step: stepJson,
              state: RunState.Pending,
              performance: {
                duration: 25,
              },
              values: [
                ScrapperRunStepValueModel.create({
                  value: 'test',
                  sourceElement: {
                    id: 'test',
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    });

    await repository.save(scrapper);

    expect(scrapper).toBeDefined();

    const foundScrapper = await repository.findOneOrFail(scrapper.id, {
      relations: [
        'createdBy',
        'steps',
        'runs',
        'runs.results',
        'runs.results.values',
      ],
    });

    expect(foundScrapper).toEqual(scrapper);
  });
});
