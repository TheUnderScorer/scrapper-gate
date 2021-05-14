import { fireEvent } from '@testing-library/react';

export const dragSelectionIntoCanvas = (
  selection: HTMLElement,
  canvas: HTMLElement
) => {
  fireEvent.dragStart(selection);
  fireEvent.dragEnter(canvas);
  fireEvent.dragOver(canvas);
  fireEvent.drop(canvas);
};
