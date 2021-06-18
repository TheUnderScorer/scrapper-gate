import { Maybe } from '@scrapper-gate/shared/common';
import { Ref } from 'react';

export const setRefValue = <T>(ref: Ref<Maybe<T>>, value?: Maybe<T>) => {
  if (typeof ref === 'function') {
    ref(value);
  }

  if (typeof ref === 'object') {
    Object.assign(ref, {
      current: value,
    });
  }
};
