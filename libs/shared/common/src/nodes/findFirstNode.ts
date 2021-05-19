import { NodeLikeItem } from '@scrapper-gate/shared/schema';

export const findFirstNode = <T extends NodeLikeItem>(items: T[]) =>
  items.find((step) => !step.previousSteps?.length);
