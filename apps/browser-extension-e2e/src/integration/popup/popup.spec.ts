import { repeatUntil } from '@scrapper-gate/shared/common';
import { initialActiveTabUrl } from '@scrapper-gate/shared/routing';
import { register } from '../../actions/popup';

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
      const { page } = await register();

      const createScrapperPage = await repeatUntil(async () => {
        const btn = await page.$('.MuiFab-root');

        await btn?.click();

        const createScrapperPage = global.browser
          .pages()
          .find((page) => page.url().includes(initialActiveTabUrl));

        expect(createScrapperPage).toBeTruthy();

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return createScrapperPage!;
      });

      await repeatUntil(async () => {
        const form = await createScrapperPage.$('.create-scrapper-form');

        expect(form).toBeTruthy();
      });

      await createScrapperPage.click('text=Real browser');
      await createScrapperPage.type('[name="name"]', 'Test scrapper');
      await createScrapperPage.click('[type="submit"]');

      await repeatUntil(async () => {
        const form = await createScrapperPage.$('.scrapper-builder-form');

        expect(form).toBeTruthy();
      });
    });
  });
});
