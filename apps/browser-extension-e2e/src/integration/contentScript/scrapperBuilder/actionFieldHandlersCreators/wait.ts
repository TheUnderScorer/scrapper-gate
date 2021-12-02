import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { Duration } from '@scrapper-gate/shared/common';
import { scrapperStepActionDefinitions } from '@scrapper-gate/shared/domain/scrapper';
import {
  DurationUnit,
  ScrapperAction,
  ScrapperWaitType,
  Variable,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { FieldHandlersMap } from '../../../../fields/fields.types';
import { conditionalRulesHandler } from '../../../../fields/handlers/conditionalRules/conditionalRulesHandler';
import { durationInputHandler } from '../../../../fields/handlers/durationInputHandler';
import { selectHandler } from '../../../../fields/handlers/selectHandler';
import { CommonStepHandlers } from './commonStepHandlers';
import { getConditionalRules } from './condition';

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
  commonFields: CommonStepHandlers,
  variables: Variable[]
) => {
  const variable = faker.random.arrayElement(variables);

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

    cases[fieldNameCreator('conditionalRules')] = {
      handler: conditionalRulesHandler(
        getConditionalRules(
          variable,
          scrapperStepActionDefinitions[ScrapperAction.Wait]
            .supportedConditionalTypes
        ),
        variables
      ),
    };
  }

  return cases;
};
