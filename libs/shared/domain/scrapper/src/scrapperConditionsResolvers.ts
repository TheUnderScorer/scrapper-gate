import {
  ConditionalRuleTypes,
  HtmlElementResolverParams,
  makeHtmlElementResolver,
  makeDateResolver,
} from '@scrapper-gate/shared/domain/conditional-rules';

export interface ScrapperConditionsResolversParams {
  htmlResolver: HtmlElementResolverParams;
}

export const makeScrapperConditionsResolvers = ({
  htmlResolver,
}: ScrapperConditionsResolversParams) => ({
  [ConditionalRuleTypes.Date]: makeDateResolver(),
  [ConditionalRuleTypes.HtmlElement]: makeHtmlElementResolver(htmlResolver),
});
