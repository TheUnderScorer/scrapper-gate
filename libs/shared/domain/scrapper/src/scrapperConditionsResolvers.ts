import {
  ConditionalRuleTypes,
  HtmlElementResolverParams,
  makeDateResolver,
  makeHtmlElementResolver,
  makeVariableResolver,
  RuleResolvers,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ScrapperStep, Variable } from '@scrapper-gate/shared/schema';
import { filter, pipe } from 'remeda';
import { scrapperStepActionDefinitions } from './scrapperActionDefinitions';

export interface ScrapperConditionsResolversParams {
  htmlResolver: HtmlElementResolverParams;
  variables: Variable[];
  step: Pick<ScrapperStep, 'action' | 'conditionalRules'>;
}

export const makeScrapperConditionsResolvers = ({
  htmlResolver,
  variables,
  step,
}: ScrapperConditionsResolversParams): RuleResolvers => {
  const definitions = {
    [ConditionalRuleTypes.Date]: makeDateResolver(),
    [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver(htmlResolver),
    [ConditionalRuleTypes.Variable]: makeVariableResolver(variables),
  };

  const actionDefinition = scrapperStepActionDefinitions[step.action];

  return pipe(
    Object.entries(definitions),
    filter(([ruleType]) =>
      Boolean(
        actionDefinition.supportedConditionalTypes?.includes(
          ruleType as ConditionalRuleTypes
        )
      )
    ),
    Object.fromEntries
  );
};
