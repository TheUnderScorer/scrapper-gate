import { Ref } from 'react';

export const setRefValue = <T>(ref: Ref<T>, value?: T) => {
  if (typeof ref === 'function') {
    ref(value);
  }

  if (typeof ref === 'object') {
    Object.assign(ref, {
      current: value,
    });
  }
};
