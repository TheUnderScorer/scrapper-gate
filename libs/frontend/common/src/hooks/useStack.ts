import { getLastIndex, last } from '@scrapper-gate/shared/common';
import { useCallback } from 'react';
import { useList } from 'react-use';

export const useStack = <T>(defaultValue?: T[]) => {
  const [list, listMethods] = useList(defaultValue);

  const pop = useCallback(() => {
    const lastItem = last(list);

    listMethods.removeAt(getLastIndex(list));

    return lastItem;
  }, [list, listMethods]);

  return [
    list,
    {
      ...listMethods,
      pop,
    },
  ];
};

export type UseStackResult = ReturnType<typeof useStack>;
