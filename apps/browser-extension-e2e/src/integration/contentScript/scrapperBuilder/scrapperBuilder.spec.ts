import { first } from '@scrapper-gate/shared/common';
import { ScrapperAction, ScrapperType } from '@scrapper-gate/shared/schema';
import { Page } from 'playwright';
import { createNewUserWithScrapper } from '../../../actions/createNewUserWithScrapper';
import { createBrowser } from '../../../browser';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';
import { dragElementBy } from '../../../utils/drag';
import { getScrapperFieldHandlerForAction } from './getScrapperFieldHandlerForAction';

async function connectFirstNodeToStartNode(
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

describe('Scrapper builder', () => {
  it('should let user change scrapper name', async () => {
    const browser = await createBrowser();

    const name = 'Test Name';

    const page = new ScrapperBuilderPage(
      await createNewUserWithScrapper(browser, ScrapperType.RealBrowser)
    );

    await page.setName(name);

    expect(await page.getName()).toBe(name);
  });

  it('should add new step via drag and drop', async () => {
    const browser = await createBrowser();

    const page = new ScrapperBuilderPage(
      await createNewUserWithScrapper(browser, ScrapperType.RealBrowser)
    );

    const { node } = await page.dragStepIntoCanvas(ScrapperAction.Click);

    expect(node).toBeTruthy();
  });

  it('should add new node via context menu', async () => {
    const browser = await createBrowser();

    const page = new ScrapperBuilderPage(
      await createNewUserWithScrapper(browser, ScrapperType.RealBrowser)
    );

    const { node } = await page.addStepViaContextMenu(ScrapperAction.Click);

    expect(node).toBeTruthy();
  });

  it('should connect node with start node', async () => {
    const browser = await createBrowser();
    const browserPage = await createNewUserWithScrapper(
      browser,
      ScrapperType.RealBrowser
    );

    const page = new ScrapperBuilderPage(browserPage);

    await connectFirstNodeToStartNode(page, browserPage);
  });

  // TODO Replace with all actions after refactoring conditional step
  it.each([
    ScrapperAction.Screenshot,
    ScrapperAction.ReloadPage,
    ScrapperAction.NavigateTo,
    ScrapperAction.ReadAttribute,
    ScrapperAction.Wait,
    ScrapperAction.GoBack,
    ScrapperAction.ChangeRunSettings,
    ScrapperAction.Click,
    ScrapperAction.ReadText,
  ])('should edit single step for %s', async (action) => {
    const browser = await createBrowser();
    const browserPage = await createNewUserWithScrapper(
      browser,
      ScrapperType.RealBrowser
    );

    const page = new ScrapperBuilderPage(browserPage);

    const { id, node } = await connectFirstNodeToStartNode(
      page,
      browserPage,
      action
    );

    const { handler, fieldNameCreator, getHandlerForIndex } =
      await getScrapperFieldHandlerForAction({
        action,
        node,
        page: browserPage,
        scraperPage: page,
      });

    await page.openNode(id);

    await handler.fillAll();

    const key = await handler.getValue(fieldNameCreator('key'));

    await page.closeCurrentNode();

    await page.submit();

    const newNodeIndex = await page.getNodeIndex(key, 'key');
    const newHandler = await getHandlerForIndex(newNodeIndex);

    await page.openNode(key, 'key');

    await newHandler.assertAll();
  });

  describe('Read attribute action', () => {
    it('should suggest attributes from selected elements', async () => {
      const browser = await createBrowser();
      const browserPage = await createNewUserWithScrapper(
        browser,
        ScrapperType.RealBrowser
      );

      const page = new ScrapperBuilderPage(browserPage);

      const { id, node } = await connectFirstNodeToStartNode(
        page,
        browserPage,
        ScrapperAction.ReadAttribute
      );

      const { handler, fieldNameCreator } =
        await getScrapperFieldHandlerForAction({
          scraperPage: page,
          page: browserPage,
          action: ScrapperAction.ReadAttribute,
          node,
        });

      await page.openNode(id);

      await handler.fill(fieldNameCreator('selectors'), 'a');

      const attributesField = await handler.getField(
        fieldNameCreator('attributeToRead')
      );

      await attributesField.click();

      await browserPage.waitForSelector('.variables-autocomplete-suggestion');

      const suggestions = await browserPage.$$(
        '.variables-autocomplete-suggestion'
      );

      expect(suggestions).toHaveLength(1);

      expect(await first(suggestions).textContent()).toEqual('href');
    });
  });
});
