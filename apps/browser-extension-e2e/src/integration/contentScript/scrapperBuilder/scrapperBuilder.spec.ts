import { makeGetFieldName } from '@scrapper-gate/frontend/flow-builder';
import { first, wait } from '@scrapper-gate/shared/common';
import { ScrapperAction, ScrapperType } from '@scrapper-gate/shared/schema';
import { get } from 'lodash';
import { persistTestArtifact } from '../../../../../../tests/utils/artifacts';
import { createNewUserWithScrapper } from '../../../actions/createNewUserWithScrapper';
import { createBrowser } from '../../../browser';
import { FieldsHandler } from '../../../fields/FieldsHandler';
import { iframeCodeEditorHandler } from '../../../fields/handlers/iframeCodeEditorHandler';
import { textFieldHandler } from '../../../fields/handlers/textFieldHandler';
import { getTestId } from '../../../getTestId';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';
import { getScrapperFieldHandlerForAction } from './getScrapperFieldHandlerForAction';
import { connectFirstNodeToStartNode, deleteNodeCase } from './utils';

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

  it('should delete node', async () => {
    const { page } = await deleteNodeCase(true);

    const nodes = await page.getAllNodes();

    expect(nodes).toHaveLength(1);
  });

  it.each(Object.values(ScrapperAction))(
    'should edit single step for %s',
    async (action) => {
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
          scrapperPage: page,
        });

      try {
        await page.openNode(id);

        await handler.fillAll();

        const key = await handler.getValue(fieldNameCreator('key'));

        await page.closeCurrentNode();

        await page.submit();

        const newNodeIndex = await page.getNodeIndex(key, 'key');
        const newHandler = await getHandlerForIndex(newNodeIndex);

        await page.openNode(key, 'key');

        await newHandler.assertAll();
      } catch (error) {
        const formState = await page.getFormState();

        await persistTestArtifact(
          `${getTestId(browserPage)}-scrapper-builder-state.json`,
          Buffer.from(JSON.stringify(formState, null, ' '))
        );

        throw error;
      }
    }
  );

  describe('Run javascript action', () => {
    it('should fail validation if code syntax is not valid', async () => {
      const browser = await createBrowser();
      const browserPage = await createNewUserWithScrapper(
        browser,
        ScrapperType.RealBrowser
      );

      const page = new ScrapperBuilderPage(browserPage);

      const { node, id } = await connectFirstNodeToStartNode(
        page,
        browserPage,
        ScrapperAction.RunJavascript
      );

      const nodeIndex = await page.getNodeIndex(node);
      const getFieldName = makeGetFieldName(nodeIndex);

      const fieldsHandler = new FieldsHandler(
        {
          [getFieldName('key')]: {
            handler: textFieldHandler('Test'),
          },
          [getFieldName('jsCode')]: {
            handler: iframeCodeEditorHandler('() => {(;'),
          },
        },
        browserPage
      );

      await page.openNode(id);

      await fieldsHandler.fillAll();

      await wait(1000);

      const formState = await page.getFormState();

      expect(formState.hasValidationErrors).toEqual(true);

      const jsCodeError = get(formState.errors, getFieldName('jsCode'));

      expect(jsCodeError).toBeTruthy();
    });
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
          scrapperPage: page,
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
