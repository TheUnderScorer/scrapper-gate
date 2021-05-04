import {
  MouseButton,
  ScrapperAction,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { createMockUser } from '@scrapper-gate/shared/domain/user';

export const createMockScrapperStep = (
  createdBy = createMockUser()
): ScrapperStep => {
  const action: ScrapperAction = faker.random.arrayElement(
    Object.values(ScrapperAction)
  );

  const baseStep: ScrapperStep = {
    action,
    id: faker.datatype.uuid(),
    createdBy,
    createdAt: new Date(),
    updatedAt: new Date(),
    url: faker.internet.url(),
    useUrlFromPreviousStep: faker.datatype.boolean(),
    position: {
      x: faker.datatype.number(500),
      y: faker.datatype.number(500),
    },
  };

  switch (action) {
    case ScrapperAction.Click:
      baseStep.mouseButton = faker.random.arrayElement(
        Object.values(MouseButton)
      );
      baseStep.clickTimes = faker.datatype.number(4);

      break;

    case ScrapperAction.Type:
      baseStep.typeDelay = faker.datatype.number(1500);
      baseStep.typeValue = faker.lorem.words();

      break;
  }

  return baseStep;
};
