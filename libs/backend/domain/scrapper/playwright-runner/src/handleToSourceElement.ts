import { ScrapperRunValueElement } from '@scrapper-gate/shared/schema';
import { ElementHandle } from 'playwright';

export const handleToSourceElement = async (
  el: ElementHandle<SVGElement | HTMLElement>
): Promise<ScrapperRunValueElement> => ({
  id: await el.evaluate((el) => el.id),
  tag: await el.evaluate((el) => el.tagName.toLowerCase()),
  classNames: await el.evaluate((el) => el.classList.toString().split(' ')),
});
