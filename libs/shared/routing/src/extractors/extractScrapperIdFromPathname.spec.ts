import { browserExtensionRoutes } from '../browserExtensionRoutes';
import { extractScrapperIdFromPathname } from './extractScrapperIdFromPathname';

describe('Extract scrapper id from route', () => {
  it('should extract scrapper id', () => {
    const route = browserExtensionRoutes.content.scrapper({
      scrapperId: '#id',
      drawerOpen: true,
    });

    expect(extractScrapperIdFromPathname(route)).toEqual('#id');
  });
});
