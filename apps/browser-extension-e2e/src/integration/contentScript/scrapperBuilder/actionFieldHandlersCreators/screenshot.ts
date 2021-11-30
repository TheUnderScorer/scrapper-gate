import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import faker from 'faker';
import { FieldHandlersMap } from '../../../../fields/fields.types';
import { checkboxHandler } from '../../../../fields/handlers/checkboxHandler';
import { CommonStepHandlers } from './commonStepHandlers';

export const screenshot = (
  fieldNameCreator: FieldNameCreator,
  commonFields: CommonStepHandlers
) => {
  const includeSelectors = faker.datatype.boolean();

  let cases: FieldHandlersMap = {
    ...commonFields.keyHandler,
    ...commonFields.url,
  };

  if (includeSelectors) {
    cases = {
      ...cases,
      ...commonFields.selectors,
    };
  } else {
    cases[fieldNameCreator('fullPageScreenshot')] = {
      handler: checkboxHandler(faker.datatype.boolean()),
    };
  }

  return cases;
};
