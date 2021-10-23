import {
  extractScrapperRunIdFromPathname,
  RunResultRouteParams,
} from '@scrapper-gate/shared/routing';
import { StoredRoute } from '../../../extension/browser/communication/messageResult.types';
import { useContentRouteParams } from './useContentRouteParams';

const extractor = (route: StoredRoute): RunResultRouteParams => {
  const id = extractScrapperRunIdFromPathname(route.pathname);

  console.log({ id });

  return {
    runId: id,
  };
};

export const useActiveScrapperRunIdInContent = () =>
  useContentRouteParams(extractor);
