import { MouseButton } from '@scrapper-gate/shared/schema';

export const mouseButtonsMap: Record<MouseButton, string> = {
  [MouseButton.Left]: 'Left',
  [MouseButton.Middle]: 'Middle',
  [MouseButton.Right]: 'Right',
};

export const mouseButtonsMapArr = Object.entries(mouseButtonsMap);
