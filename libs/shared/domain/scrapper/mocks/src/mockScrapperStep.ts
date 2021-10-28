import { repeatUntil } from '@scrapper-gate/shared/common';
import { createMockUser } from '@scrapper-gate/shared/domain/user/mocks';
import {
  MouseButton,
  ScrapperAction,
  ScrapperStep,
  User,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { v4 } from 'uuid';

export interface CreateMockScrapperStepArgs {
  createdBy?: User;
  disabledActions?: ScrapperAction[];
  intercept?: (step: ScrapperStep) => ScrapperStep;
}

export const createMockScrapperStep = async ({
  createdBy = createMockUser(),
  disabledActions = [],
  intercept,
}: CreateMockScrapperStepArgs): Promise<ScrapperStep> => {
  const action = await repeatUntil(
    () => faker.random.arrayElement(Object.values(ScrapperAction)),
    {
      conditionChecker: (action) => !disabledActions.includes(action),
    }
  );

  const baseStep: ScrapperStep = {
    action,
    id: v4(),
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

    case ScrapperAction.ReadAttribute:
      baseStep.attributeToRead = faker.random.arrayElement([
        'href',
        'class',
        'id',
        'data-test',
      ]);
      break;

    case ScrapperAction.Type:
      baseStep.typeDelay = faker.datatype.number(1500);
      baseStep.typeValue = faker.lorem.words();

      break;
  }

  return intercept ? intercept(baseStep) : baseStep;
};
