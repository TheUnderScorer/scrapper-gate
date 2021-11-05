import { Duration } from '@scrapper-gate/shared/common';
import { Maybe, RunnerPerformanceEntry } from '@scrapper-gate/shared/schema';

export type EntitiesWithTotal<T> = [T[], number];

export type BackendRunnerPerformanceEntry = Omit<
  RunnerPerformanceEntry,
  'duration'
> & {
  duration?: Maybe<Duration>;
};
