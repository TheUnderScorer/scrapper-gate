import {
  htmlElementResolver,
  HtmlElementResolverElementDefinition,
} from '@scrapper-gate/shared/domain/conditional-rules';
import { ElementHandle } from 'playwright';

export const elementHandlesToHtmlElementRuleDefinition = async (
  elements: ElementHandle<SVGElement | HTMLElement>[]
): Promise<HtmlElementResolverElementDefinition[]> => {
  const promises = elements.map(async (element) =>
    htmlElementResolver.createElementDefinition(
      await element.evaluate((el) => {
        const attributes = Array.from(el.attributes).reduce(
          (acc, { name, value }) => ({
            ...acc,
            [name]: value,
          }),
          {}
        );

        return {
          tagName: el.tagName,
          textContent: el.textContent,
          attributes,
        };
      })
    )
  );

  return Promise.all(promises);
};
