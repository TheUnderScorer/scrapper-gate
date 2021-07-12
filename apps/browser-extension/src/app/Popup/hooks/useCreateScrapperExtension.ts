import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';
import { useCallback } from 'react';
import { useContentToggle } from '../../../extension/browser/communication/hooks/useContentToggle';

export const useCreateScrapperExtension = () => {
  const [toggleContent] = useContentToggle();

  return useCallback(async () => {
    await toggleContent({
      visible: true,
      path: browserExtensionRoutes.content.createScrapper,
    });
  }, [toggleContent]);
};
