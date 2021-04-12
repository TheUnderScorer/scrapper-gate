import React, { PropsWithChildren, useState } from 'react';
import { MemoryRouter } from 'react-router';
import { LocationDescriptor } from 'history';
import { useMount } from 'react-use';
import { getLatestContentRoute } from '../queries/getLatestContentRoute';

export const ContentRouter = ({ children }: PropsWithChildren<unknown>) => {
  const [initialEntries, setInitialEntries] = useState<
    LocationDescriptor[] | null | undefined
  >(undefined);

  useMount(() => {
    getLatestContentRoute().then((route) => {
      if (route) {
        setInitialEntries([
          {
            ...route,
          },
        ]);
      } else {
        setInitialEntries(null);
      }
    });
  });

  if (initialEntries === undefined) {
    return null;
  }

  return (
    <MemoryRouter initialEntries={initialEntries ?? undefined}>
      {children}
    </MemoryRouter>
  );
};
