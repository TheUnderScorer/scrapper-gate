import { MouseButton } from '@scrapper-gate/shared/schema';

export const mouseButtonMap = {
  [MouseButton.Left]: 'left',
  [MouseButton.Middle]: 'middle',
  [MouseButton.Right]: 'right',
} as const;
