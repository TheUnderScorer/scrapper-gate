import {
  extractScrapperIdFromPathname,
  ScrapperRouteParams,
} from '@scrapper-gate/shared/routing';
import { StoredRoute } from '../../../extension/browser/communication/messageResult.types';
import { useContentRouteParams } from './useContentRouteParams';

const extractor = (route: StoredRoute) => {
  const id = extractScrapperIdFromPathname(route?.pathname ?? '');

  return {
    scrapperId: id,
  };
};

export const useActiveScrapperIdInContent = () =>
  useContentRouteParams<ScrapperRouteParams>(extractor);
