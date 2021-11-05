import { resolveRules } from '@scrapper-gate/shared/domain/conditional-rules';
import {
  makeScrapperConditionsResolvers,
  ScrapperConditionsResolversParams,
} from './scrapperConditionsResolvers';

export const resolveScrapperStepRules = (
  params: ScrapperConditionsResolversParams
) =>
  resolveRules({
    resolvers: makeScrapperConditionsResolvers(params),
    ruleGroups: params.step.conditionalRules ?? [],
  });
