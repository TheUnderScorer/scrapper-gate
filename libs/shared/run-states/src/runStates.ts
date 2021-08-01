import { RunState } from '@scrapper-gate/shared/schema';

export const runStates = [RunState.Pending, RunState.InProgress];

export const completedRunStates = [RunState.Completed, RunState.Failed];

export const isRunning = (
  state?: RunState
): state is typeof runStates[number] =>
  Boolean(state && runStates.includes(state));

export const isCompleted = (
  state?: RunState
): state is typeof completedRunStates[number] =>
  Boolean(state && completedRunStates.includes(state));
