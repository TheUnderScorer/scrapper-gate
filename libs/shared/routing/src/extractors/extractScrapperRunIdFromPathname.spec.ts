import { browserExtensionRoutes } from '../browserExtensionRoutes';
import { extractScrapperRunIdFromPathname } from './extractScrapperRunIdFromPathname';

describe('Extract scrapper run id', () => {
  it('should extract scrapper run id', () => {
    const route = browserExtensionRoutes.content.scrapperRun({
      runId: '#id',
      drawerOpen: true,
    });

    expect(extractScrapperRunIdFromPathname(route)).toEqual('#id');
  });
});
