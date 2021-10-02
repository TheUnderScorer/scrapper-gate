import { Dispatch, SetStateAction } from 'react';
import { useMount } from 'react-use';
import { BooleanParam, useQueryParam } from 'use-query-params';
import { OpenState } from './types';

export const makeUseQueryParamOpenState =
  (queryKey: string) => (): OpenState => {
    const [open, setOpen] = useQueryParam(queryKey, BooleanParam);

    useMount(() => {
      if (typeof open !== 'boolean') {
        setOpen(true);
      }
    });

    return {
      open: Boolean(open),
      setOpen: setOpen as Dispatch<SetStateAction<boolean>>,
    };
  };
