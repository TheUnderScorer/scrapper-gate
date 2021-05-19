import { resolveRules } from '@scrapper-gate/shared/domain/conditional-rules';
import { ScrapperStep } from '@scrapper-gate/shared/schema';
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
