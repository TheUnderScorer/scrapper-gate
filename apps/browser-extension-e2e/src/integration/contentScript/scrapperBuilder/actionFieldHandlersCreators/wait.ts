import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { Duration } from '@scrapper-gate/shared/common';
import { DurationUnit, ScrapperWaitType } from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { FieldHandlersMap } from '../../../../utils/fields/fields.types';
import { durationInputHandler } from '../../../../utils/fields/handlers/durationInputHandler';
import { selectHandler } from '../../../../utils/fields/handlers/selectHandler';
import { CommonStepHandlers } from './commonStepHandlers';

const randomDuration = () =>
  Duration.fromUnit(
    faker.datatype.number(9999),
    faker.random.arrayElement([
      DurationUnit.Milliseconds,
      DurationUnit.Minutes,
      DurationUnit.Seconds,
    ])
  );

export const waitSection = async (
  fieldNameCreator: FieldNameCreator,
  commonFields: CommonStepHandlers
) => {
  const waitType = faker.random.objectElement(ScrapperWaitType);

  const cases: FieldHandlersMap = {
    [fieldNameCreator('waitType')]: {
      handler: selectHandler(waitType),
    },
    ...commonFields.url,
    ...commonFields.keyHandler,
  };

  if (waitType === ScrapperWaitType.Time) {
    cases[fieldNameCreator('waitDuration')] = {
      handler: durationInputHandler(randomDuration()),
    };
  } else if (waitType === ScrapperWaitType.Condition) {
    cases[fieldNameCreator('waitIntervalCheck')] = {
      handler: durationInputHandler(randomDuration()),
    };

    cases[fieldNameCreator('waitIntervalTimeout')] = {
      handler: durationInputHandler(randomDuration()),
    };

    // TODO Add conditional rules after refactor
  }

  return cases;
};
