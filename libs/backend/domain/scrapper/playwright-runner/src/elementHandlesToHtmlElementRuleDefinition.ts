import {
  createHtmlResolverElementDefinition,
  HtmlElementResolverElementDefinition,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ElementHandle } from 'playwright';

export const elementHandlesToHtmlElementRuleDefinition = async (
  elements: ElementHandle<SVGElement | HTMLElement>[]
): Promise<HtmlElementResolverElementDefinition[]> => {
  const promises = elements.map(async (element) =>
    createHtmlResolverElementDefinition(
      await element.evaluate((el) => ({
        tagName: el.tagName,
        textContent: el.textContent,
        attributes: el.attributes,
      }))
    )
  );

  return Promise.all(promises);
};
