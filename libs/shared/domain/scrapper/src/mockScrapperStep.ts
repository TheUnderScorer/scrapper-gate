import {
  MouseButton,
  ScrapperAction,
  ScrapperStep,
  User,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { createMockUser } from '@scrapper-gate/shared/domain/user';
import { repeatUntil } from '@scrapper-gate/shared/common';

export interface CreateMockScrapperStepArgs {
  createdBy?: User;
  disabledActions?: ScrapperAction[];
}

export const createMockScrapperStep = async ({
  createdBy = createMockUser(),
  disabledActions = [],
}: CreateMockScrapperStepArgs): Promise<ScrapperStep> => {
  const action = await repeatUntil(
    () => faker.random.arrayElement(Object.values(ScrapperAction)),
    (action) => !disabledActions.includes(action)
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
