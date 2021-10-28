import { ScrapperType } from '@scrapper-gate/shared/schema';
import { registerToMatchImageSnapshot } from '../../../../../tests/jestExtensions/toMatchImageSnapshot';
import { createNewUserWithScrapper } from '../../actions/createNewUserWithScrapper';
import { register } from '../../actions/popup';
import { createBrowser } from '../../browser';
import { debugPage } from '../../utils/debug';
import { navigateToPopup } from '../../utils/navigation';
import { repeatUntil } from '../../utils/repeatUntil';

registerToMatchImageSnapshot();

describe('Popup', () => {
  describe('Scrappers list', () => {
    it('should show scrapper list after login', async () => {
      const { page } = await register(await createBrowser());

      await repeatUntil(async () => {
        const list = await page.$('#my_scrappers_list');

        if (!list) {
          await debugPage(page);
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

      await repeatUntil(async () => {
        const listItems = await page.$$('.scrapper-list-item');

        expect(listItems).toHaveLength(1);
      });

      const popupContent = await page.$('.popup-content');

      const screenshot = await popupContent?.screenshot();

      expect(screenshot).toMatchImageSnapshot({
        customSnapshotIdentifier: 'List with scrapper',
      });
    });
  });
});
