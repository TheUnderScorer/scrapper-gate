import { repeatUntil } from '@scrapper-gate/shared/common';
import { registerToMatchImageSnapshot } from '../../../../../tests/jestExtensions/toMatchImageSnapshot';
import { createNewUserWithScrapper } from '../../actions/createNewUserWithScrapper';
import { register } from '../../actions/popup';
import { createBrowser } from '../../browser';
import { navigateToPopup } from '../../utils/navigation';

registerToMatchImageSnapshot();

const waitAfterIteration = 1000;

describe('Popup', () => {
  describe('Scrappers list', () => {
    it('should show scrapper list after login', async () => {
      const { page } = await register(await createBrowser());

      await repeatUntil(
        async () => {
          const list = await page.$('#my_scrappers_list');

          expect(list).toBeDefined();
        },
        {
          waitAfterIteration,
        }
      );
    });

    it('should let user create new scrapper', async () => {
      const page = await createNewUserWithScrapper(await createBrowser());

      await repeatUntil(
        async () => {
          const form = await page.$('.scrapper-builder-form');

          expect(form).toBeTruthy();
        },
        {
          waitAfterIteration,
        }
      );
    });

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
  });
});
