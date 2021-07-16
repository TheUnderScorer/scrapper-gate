import { RunState } from '@scrapper-gate/shared/schema';

export const runStates: RunState[] = [RunState.Pending, RunState.InProgress];

export const completedRunStates: RunState[] = [
  RunState.Completed,
  RunState.Failed,
];

export const isRunning = (state?: RunState): state is RunState =>
  Boolean(state && runStates.includes(state));

export const isCompleted = (state?: RunState): state is RunState =>
  Boolean(state && completedRunStates.includes(state));
