import { repeatUntil as baseRepeatUntil } from '@scrapper-gate/shared/common';

export const repeatUntil = baseRepeatUntil.make({
  waitAfterIteration: 1000,
});
