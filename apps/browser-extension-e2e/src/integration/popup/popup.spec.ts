import { repeatUntil } from '@scrapper-gate/shared/common';
import { registerToMatchImageSnapshot } from '../../../../../tests/jestExtensions/toMatchImageSnapshot';
import { register } from '../../actions/popup';
import { createNewUserWithScrapper } from '../../actions/createNewUserWithScrapper';
import { navigateToPopup } from '../../utils/navigation';

registerToMatchImageSnapshot();

describe('Popup', () => {
  describe('Scrappers list', () => {
    it('should show scrapper list after login', async () => {
      const { page } = await register();

      await repeatUntil(async () => {
        const list = await page.$('#my_scrappers_list');

        expect(list).toBeDefined();
      });
    });

    it('should let user create new scrapper', async () => {
      const page = await createNewUserWithScrapper();

      await repeatUntil(async () => {
        const form = await page.$('.scrapper-builder-form');

        expect(form).toBeTruthy();
      });
    });

    it('should list user scrappers', async () => {
      await createNewUserWithScrapper();

      const page = await global.browser.newPage();

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
