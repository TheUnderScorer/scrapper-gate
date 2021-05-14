import { SyntheticEvent } from 'react';

export const stopPropagation = (event: Event | SyntheticEvent) => {
  event.stopPropagation();

  return event;
};
