import { ScrapperStep } from '@scrapper-gate/shared/schema';
import { resolveRules } from '../../conditional-rules/src/resolveRules';
import {
  makeScrapperConditionsResolvers,
  ScrapperConditionsResolversParams,
} from './scrapperConditionsResolvers';

export const resolveScrapperStepRules = (
  step: ScrapperStep,
  params: ScrapperConditionsResolversParams
) =>
  resolveRules({
    resolvers: makeScrapperConditionsResolvers(params),
    ruleGroups: step.conditionalRules ?? [],
  });
