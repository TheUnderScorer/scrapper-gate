import { ElementHandle, Page } from 'playwright';

export interface DragXY {
  x: number;
  y: number;
}

export const dragElementBy = async (
  page: Page,
  handle: ElementHandle,
  by: DragXY
) => {
  const box = await handle.boundingBox();

  if (!box) {
    throw new Error('Unable to get bounding box');
  }

  const { mouse } = page;

  await mouse.move(box.x, box.y);

  await mouse.down({
    button: 'left',
  });

  await mouse.move(box.x + by.x, box.y + by.y);

  await mouse.up({
    button: 'left',
  });
};
