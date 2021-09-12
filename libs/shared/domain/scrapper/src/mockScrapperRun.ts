import { createBaseEntity } from '@scrapper-gate/shared/common';
import { createMockUser } from '@scrapper-gate/shared/domain/user';
import {
  RunState,
  ScrapperRun,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';

export const createMockScrapperRun = (
  steps: ScrapperStep[],
  createdBy = createMockUser()
): ScrapperRun => ({
  ...createBaseEntity(),
  steps,
  index: 0,
  createdBy,
  state: RunState.InProgress,
  results: steps.map((step) => ({
    ...createBaseEntity(),
    step,
    state: RunState.Pending,
  })),
});
