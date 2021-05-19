import {
  createHtmlElementResolverElementDefinition,
  HtmlElementResolverElementDefinition,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ElementHandle } from 'playwright';

export const elementHandlesToHtmlElementRuleDefinition = async (
  elements: ElementHandle<SVGElement | HTMLElement>[]
): Promise<HtmlElementResolverElementDefinition[]> => {
  const promises = elements.map(async (element) =>
    createHtmlElementResolverElementDefinition(
      await element.evaluate((el) => el)
    )
  );

  return Promise.all(promises);
};
