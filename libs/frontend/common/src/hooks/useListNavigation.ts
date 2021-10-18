import { first, getLastIndex } from '@scrapper-gate/shared/common';
import { useCallback, useEffect, useState } from 'react';
import { useKey } from 'react-use';
import { Key } from 'ts-key-enum';

export interface UseListNavigationProps<T> {
  items: T[];
  onEnter?: (activeItem: T) => unknown;
  disabled?: boolean;
}

export enum NavigationDirection {
  Top = 'Top',
  Bottom = 'Bottom',
}

export const useListNavigation = <T>({
  items,
  onEnter,
  disabled,
}: UseListNavigationProps<T>) => {
  const [activeItem, setActiveItem] = useState(first(items));

  const handleNavigation = useCallback(
    (direction: NavigationDirection) => {
      if (disabled) {
        return;
      }

      const activeItemIndex = items.indexOf(activeItem);
      const lastIndex = getLastIndex(items);

      let newIndex =
        direction === NavigationDirection.Top
          ? activeItemIndex - 1
          : activeItemIndex + 1;

      if (newIndex === -1) {
        newIndex = lastIndex;
      } else if (newIndex > lastIndex) {
        newIndex = 0;
      }

      const newActiveItem = items[newIndex];

      setActiveItem(newActiveItem ?? first(items));
    },
    [activeItem, disabled, items]
  );

  useKey(
    Key.ArrowUp,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation(NavigationDirection.Top);
    },
    {},
    [handleNavigation]
  );

  useKey(
    Key.ArrowDown,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation(NavigationDirection.Bottom);
    },
    {},
    [handleNavigation]
  );

  useKey(
    Key.Enter,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (disabled) {
        return;
      }

      onEnter?.(activeItem);
    },
    {},
    [onEnter, activeItem, disabled]
  );

  useEffect(() => {
    if (!items.includes(activeItem)) {
      setActiveItem(first(items));
    }
  }, [activeItem, items]);

  return {
    activeItem,
    setActiveItem,
    handleNavigation,
  };
};
