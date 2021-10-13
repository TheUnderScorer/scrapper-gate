import { RunState } from '@scrapper-gate/shared/schema';

export const runStates = [RunState.Pending, RunState.InProgress];

export const completedRunStates = [RunState.Completed, RunState.Failed];

export const skippableRunStates = [RunState.Pending, RunState.InProgress];

export const isRunning = (state?: RunState) =>
  Boolean(state && runStates.includes(state));

export const isCompleted = (state?: RunState) =>
  Boolean(state && completedRunStates.includes(state));

export const canBeSkipped = (state?: RunState) =>
  Boolean(state && skippableRunStates.includes(state));
