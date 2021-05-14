import { UserModel } from '@scrapper-gate/backend/domain/user';
import { createMockUser } from '@scrapper-gate/shared/domain/user';
import '../../../../../../typings/global';
import * as faker from 'faker';
import { MouseButton, ScrapperAction } from '@scrapper-gate/shared/schema';
import { ScrapperModel } from './Scrapper.model';
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
      steps: [
        ScrapperStepModel.create({
          action: ScrapperAction.Click,
          mouseButton: MouseButton.Right,
          url: faker.internet.url(),
        }),
      ],
    });

    await repository.save(scrapper);

    const foundScrapper = await repository.findOneOrFail(scrapper.id, {
      relations: ['createdBy', 'steps'],
    });

    expect(foundScrapper).toEqual(scrapper);
  });
});
