import { NodeLikeItem } from './types';

export const findFirstNode = <T extends NodeLikeItem>(items: T[]) =>
  items.find((step) => step.isFirst);
