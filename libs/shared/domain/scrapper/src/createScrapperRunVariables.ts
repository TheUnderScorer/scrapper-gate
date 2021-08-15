import { createVariable } from '@scrapper-gate/shared/domain/variables';
import { ScrapperRun, VariableScope } from '@scrapper-gate/shared/schema';
import { uniqBy } from 'remeda';

/**
 * Creates scrapper variables, creating variables from run result and appending them to existing scrapper variables
 * */
export const createScrapperRunVariables = (scrapperRun: ScrapperRun) => {
  if (!scrapperRun.results?.length) {
    return [];
  }

  const variablesFromRun = scrapperRun.results
    .filter((result) => result.step.key)
    .map((result) => {
      return createVariable({
        key: result.step.key,
        value: result.values?.map((value) => value.value),
        scope: VariableScope.Scrapper,
      });
    });

  return uniqBy(
    [...variablesFromRun, ...(scrapperRun.variables ?? [])],
    (variable) => variable.key
  );
};
