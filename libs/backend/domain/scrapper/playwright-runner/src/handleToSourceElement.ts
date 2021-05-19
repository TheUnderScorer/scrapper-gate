import { ScrapperRunValueElement } from '@scrapper-gate/shared/schema';
import { ElementHandle } from 'playwright';

export const handleToSourceElement = async (
  el: ElementHandle<SVGElement | HTMLElement>
): Promise<ScrapperRunValueElement> => {
  return el.evaluate((element) => ({
    id: element.id,
    tag: element.tagName.toLowerCase(),
    classNames: element.classList.toString().split(' '),
  }));
};
