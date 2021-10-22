import { ScrapperType } from '@scrapper-gate/shared/schema';
import { registerToMatchImageSnapshot } from '../../../../../tests/jestExtensions/toMatchImageSnapshot';
import { createNewUserWithScrapper } from '../../actions/createNewUserWithScrapper';
import { register } from '../../actions/popup';
import { createBrowser } from '../../browser';
import { navigateToPopup } from '../../utils/navigation';
import { repeatUntil } from '../../utils/repeatUntil';
import { createTestArtifact } from './createTestArtifact';

registerToMatchImageSnapshot();

describe('Popup', () => {
  describe('Scrappers list', () => {
    it('should show scrapper list after login', async () => {
      const { page } = await register(await createBrowser());

      await repeatUntil(async () => {
        const list = await page.$('#my_scrappers_list');

        if (!list) {
          await createTestArtifact(page);
        }

        expect(list).toBeTruthy();
      });
    });

    it.each(Object.values(ScrapperType))(
      'should let user create new scrapper %s',
      async (type) => {
        const page = await createNewUserWithScrapper(
          await createBrowser(),
          type
        );

        await repeatUntil(async () => {
          const form = await page.$('.scrapper-builder-form');

          expect(form).toBeTruthy();
        });
      }
    );

    it('should list user scrappers', async () => {
      const browser = await createBrowser();

      await createNewUserWithScrapper(browser);

      const page = await browser.newPage();

      await navigateToPopup(page);

      const listItems = await page.$$('.scrapper-list-item');

      expect(listItems).toHaveLength(1);

      const popupContent = await page.$('.popup-content');

      const screenshot = await popupContent?.screenshot();

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: 'List with scrapper',
      });
    });

    it('should open scrapper after clicking it in list', async () => {
      const browser = await createBrowser();

      await createNewUserWithScrapper(browser).then((page) => page.close());

      const page = await browser.newPage();

      await navigateToPopup(page);

      await page.click('.scrapper-list-item');

      await repeatUntil(async () => {
        const result = await Promise.allSettled(
          browser.pages().map(async (page) => {
            const form = await page.$('.scrapper-builder-form');

            expect(form).toBeTruthy();
          })
        );

        expect(
          result.some((promiseResult) => promiseResult.status === 'fulfilled')
        ).toEqual(true);
      });
    });
  });
});
