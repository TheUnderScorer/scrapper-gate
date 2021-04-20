import { getActiveTabInContent } from './getActiveTab';
import { StoredRoute } from '../../browser/communication/types';

export const getLatestContentRoute = async (): Promise<
  StoredRoute | undefined
> => {
  const activeTab = await getActiveTabInContent();

  return undefined;

  /*const { contentRoutes = {} } = await browserLocalStorage.get([
    'contentRoutes',
  ]);

  if (!activeTab?.id) {
    return undefined;
  }

  return contentRoutes[activeTab.id];*/
};
