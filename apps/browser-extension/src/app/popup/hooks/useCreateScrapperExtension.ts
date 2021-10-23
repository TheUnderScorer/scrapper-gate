import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { useCallback } from 'react';
import { useContentToggle } from '../../../extension/browser/communication/hooks/useContentToggle';

export const useCreateScrapperExtension = () => {
  const [toggleContent] = useContentToggle();

  return useCallback(async () => {
    const result = await toggleContent({
      visible: true,
      path: browserExtensionRoutes.content.createScrapper,
    });

    if (result && !result.payload?.tabCreated) {
      window.close();
    }
  }, [toggleContent]);
};
