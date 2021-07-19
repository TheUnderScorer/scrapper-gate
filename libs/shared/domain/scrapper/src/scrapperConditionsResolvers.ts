import {
  ConditionalRuleTypes,
  HtmlElementResolverParams,
  makeHtmlElementResolver,
  makeDateResolver,
  makeVariableResolver,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { Variable } from '@scrapper-gate/shared/schema';

export interface ScrapperConditionsResolversParams {
  htmlResolver: HtmlElementResolverParams;
  variables: Variable[];
}

export const makeScrapperConditionsResolvers = ({
  htmlResolver,
  variables,
}: ScrapperConditionsResolversParams) => ({
  [ConditionalRuleTypes.Date]: makeDateResolver(),
  [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver(htmlResolver),
  [ConditionalRuleTypes.Variable]: makeVariableResolver(variables),
});
