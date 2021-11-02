import { ScrapperBuilderStepFragment } from '@scrapper-gate/shared/schema';

export type ScrapperBuilderStep = Omit<
  ScrapperBuilderStepFragment,
  'updatedAt' | 'createdAt'
>;
