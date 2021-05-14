import { browserExtensionRoutes } from './browserExtensionRoutes';
import { extractScrapperIdFromRoute } from './extractScrapperIdFromRoute';

describe('Extract scrapper id from route', () => {
  it('should extract scrapper id', () => {
    const route = browserExtensionRoutes.content.scrapper({
      scrapperId: '#id',
      drawerOpen: true,
    });

    expect(extractScrapperIdFromRoute(route)).toEqual('#id');
  });
});
