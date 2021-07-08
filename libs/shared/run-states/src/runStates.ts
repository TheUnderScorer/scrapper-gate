import { RunState } from '@scrapper-gate/shared/schema';

export const runStates: RunState[] = [RunState.Pending, RunState.InProgress];

export const completedRunStates: RunState[] = [
  RunState.Completed,
  RunState.Failed,
];
