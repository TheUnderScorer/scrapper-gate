import { BaseEntity } from '@scrapper-gate/shared/schema';
import { useCallback } from 'react';
import {
  ToggleContentParams,
  useContentToggle as useContentToggleDefault,
} from '../../../extension/browser/communication/hooks/useContentToggle';

export interface UseContentEntityToggleParams<
  T extends Pick<BaseEntity, 'id'>
> {
  activeEntityInContentId?: string;
  // Callback that returns payload used for toggling content route
  showEntityInContent: (entity: T) => ToggleContentParams;
  useContentToggle?: typeof useContentToggleDefault;
}

/**
 * Handles toggling given entity in content script.
 * If the entity is currently active there, it will close id instead.
 * */
export const useContentEntityToggle = <T extends Pick<BaseEntity, 'id'>>({
  activeEntityInContentId,
  showEntityInContent,
  useContentToggle = useContentToggleDefault,
}: UseContentEntityToggleParams<T>) => {
  const [toggleContent] = useContentToggle();

  return useCallback(
    (entity: T) => {
      if (entity.id === activeEntityInContentId) {
        return toggleContent({
          visible: false,
          path: '/',
        });
      }

      return toggleContent(showEntityInContent(entity));
    },
    [activeEntityInContentId, showEntityInContent, toggleContent]
  );
};
