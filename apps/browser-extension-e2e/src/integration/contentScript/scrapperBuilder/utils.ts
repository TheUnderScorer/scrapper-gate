import { ScrapperAction, ScrapperType } from '@scrapper-gate/shared/schema';
import { Page } from 'playwright';
import { createNewUserWithScrapper } from '../../../actions/createNewUserWithScrapper';
import { createBrowser } from '../../../browser';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';
import { dragElementBy } from '../../../utils/drag';

export async function connectFirstNodeToStartNode(
  scrapperBuilderPage: ScrapperBuilderPage,
  browserPage: Page,
  action: ScrapperAction = ScrapperAction.Click
) {
  const { id, node } = await scrapperBuilderPage.dragStepIntoCanvas(action);

  await dragElementBy(browserPage, node, {
    x: 200,
    y: 0,
  });

  await scrapperBuilderPage.dragCanvasBy({
    x: -200,
    y: 0,
  });

  await scrapperBuilderPage.connectNodes('start', id);

  await scrapperBuilderPage.assertEdgesCount(1);

  return { node, id };
}

export async function deleteNodeCase(submit = false) {
  const browser = await createBrowser();
  const browserPage = await createNewUserWithScrapper(
    browser,
    ScrapperType.RealBrowser
  );

  const page = new ScrapperBuilderPage(browserPage);

  const { id } = await connectFirstNodeToStartNode(page, browserPage);

  await page.deleteNode(id);

  if (submit) {
    await page.submit();
  }

  return { id, page };
}
