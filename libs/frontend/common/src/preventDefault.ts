import { SyntheticEvent } from 'react';

export const preventDefault = (e: Event | SyntheticEvent) => {
  e.preventDefault();
};
