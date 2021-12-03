import { Duration, repeatUntil } from '@scrapper-gate/shared/common';
import { createMockUser } from '@scrapper-gate/shared/domain/user/mocks';
import {
  DurationUnit,
  Maybe,
  MouseButton,
  ScrapperAction,
  ScrapperStep,
  ScrapperWaitType,
  User,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { v4 } from 'uuid';

export interface CreateMockScrapperStepArgs {
  createdBy?: Maybe<User>;
  disabledActions?: ScrapperAction[];
  intercept?: (step: MockScrapperStep) => MockScrapperStep;
}

type MockScrapperStep = ScrapperStep & {
  waitDuration?: Maybe<Duration>;
  waitIntervalTimeout?: Maybe<Duration>;
  waitIntervalCheck?: Maybe<Duration>;
  nextStep?: Maybe<MockScrapperStep>;
  stepOnTrue?: Maybe<MockScrapperStep>;
  stepOnFalse?: Maybe<MockScrapperStep>;
  previousSteps?: Maybe<MockScrapperStep[]>;
};

export const createMockScrapperStep = async ({
  createdBy = createMockUser(),
  disabledActions = [],
  intercept,
}: CreateMockScrapperStepArgs): Promise<MockScrapperStep> => {
  const action = await repeatUntil(
    () => faker.random.arrayElement(Object.values(ScrapperAction)),
    {
      conditionChecker: (action) => !disabledActions.includes(action),
    }
  );

  const baseStep: MockScrapperStep = {
    action,
    id: v4(),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    createdBy: createdBy!,
    createdAt: new Date(),
    updatedAt: new Date(),
    url: faker.internet.url(),
    useUrlFromPreviousStep: faker.datatype.boolean(),
    key: faker.random.word(),
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

    case ScrapperAction.Wait:
      baseStep.waitType = ScrapperWaitType.Time;
      baseStep.waitDuration = Duration.fromUnit(
        faker.datatype.number(9999),
        faker.random.objectElement(DurationUnit) as DurationUnit
      );

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
