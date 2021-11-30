import { DateFormat } from '@scrapper-gate/shared/common';
import { createVariable } from '@scrapper-gate/shared/domain/variables';
import {
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import * as faker from 'faker';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';

export const createScrapperVariables = async (
  scrapperPage: ScrapperBuilderPage
) => {
  const variables: Variable[] = [
    createVariable({
      type: VariableType.Text,
      key: 'textVariable',
      value: faker.random.word(),
      scope: VariableScope.Scrapper,
    }),
    createVariable({
      type: VariableType.Number,
      key: 'numberVariable',
      value: faker.datatype.number(999),
      scope: VariableScope.Scrapper,
    }),
    createVariable({
      type: VariableType.Date,
      key: 'dateVariable',
      value: format(faker.date.recent(), DateFormat.DateTime),
      scope: VariableScope.Scrapper,
    }),
  ];

  for (const variable of variables) {
    await scrapperPage.addVariable(variable);
  }

  await scrapperPage.switchToMainTab();

  return variables;
};
