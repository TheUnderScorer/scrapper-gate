import {
  resolveScrapperStepRules,
  ScrapperStepHandlerParams,
} from '@scrapper-gate/shared/domain/scrapper';
import { ElementHandle } from 'playwright';
import { elementHandlesToHtmlElementRuleDefinition } from './elementHandlesToHtmlElementRuleDefinition';

export async function resolveCondition(
  params: ScrapperStepHandlerParams,
  elements: ElementHandle<SVGElement | HTMLElement>[]
) {
  const { result } = await resolveScrapperStepRules({
    step: params.step,
    htmlResolver: {
      elements: await elementHandlesToHtmlElementRuleDefinition(elements),
    },
    variables: params.variables ?? [],
  });

  return result;
}
