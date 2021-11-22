import {
  htmlElementResolver,
  HtmlElementResolverParams,
  makeDateResolver,
  makeVariableResolver,
  RuleResolvers,
} from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleType,
  ScrapperStep,
  Variable,
} from '@scrapper-gate/shared/schema';
import { filter, pipe } from 'remeda';
import { scrapperStepActionDefinitions } from './scrapperActionDefinitions';

export interface ScrapperConditionsResolversParams {
  htmlResolverParams: HtmlElementResolverParams;
  variables: Variable[];
  step: Pick<ScrapperStep, 'action' | 'conditionalRules'>;
}

export const makeScrapperConditionsResolvers = ({
  htmlResolverParams,
  variables,
  step,
}: ScrapperConditionsResolversParams): RuleResolvers => {
  const definitions = {
    [ConditionalRuleType.Date]: makeDateResolver(),
    [ConditionalRuleType.HtmlElement]:
      htmlElementResolver.make(htmlResolverParams),
    [ConditionalRuleType.Variable]: makeVariableResolver(variables),
  };

  const actionDefinition = scrapperStepActionDefinitions[step.action];

  return pipe(
    Object.entries(definitions),
    filter(([ruleType]) =>
      Boolean(
        actionDefinition.supportedConditionalTypes?.includes(
          ruleType as ConditionalRuleType
        )
      )
    ),
    Object.fromEntries
  );
};
