import { Duration } from '@scrapper-gate/shared/common';
import { DurationInput } from '@scrapper-gate/shared/schema';
import { ValueTransformer } from 'typeorm';

export const durationTransformer: ValueTransformer = {
  to: (duration?: Duration): DurationInput | undefined =>
    duration ? duration.toInput() : undefined,
  from: (record?: DurationInput) =>
    record ? Duration.fromInput(record) : undefined,
};
