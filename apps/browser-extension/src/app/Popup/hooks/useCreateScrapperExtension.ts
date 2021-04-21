import {
  useCreateScrapper,
  UseCreateScrapperParams,
} from '@scrapper-gate/frontend/domain/scrapper';
import { useContentToggle } from '../../../extension/browser/communication/hooks/useContentToggle';
import { browserExtensionRoutes } from '@scrapper-gate/shared/routing';

export const useCreateScrapperExtension = (
  params?: UseCreateScrapperParams
) => {
  const [toggleContent] = useContentToggle();

  return useCreateScrapper({
    ...params,
    onCompleted: async (data) => {
      console.log({ data });

      params?.onCompleted?.(data);

      if (data?.createScrapper?.id) {
        await toggleContent({
          visible: true,
          path: browserExtensionRoutes.content.scrapper({
            scrapperId: data.createScrapper.id,
            drawerOpen: true,
          }),
        });
      }
    },
  });
};
