import { getActiveTabInContent } from './getActiveTab';
import { browserLocalStorage } from '../../localStorage/browserLocalStorage';

export const wasScrapperOverlayOpened = async () => {
  const activeTab = await getActiveTabInContent();
  const { activeOverlays = [] } = await browserLocalStorage.get([
    'activeOverlays',
  ]);

  return (
    Array.isArray(activeOverlays) && activeOverlays?.includes(activeTab?.id)
  );
};
