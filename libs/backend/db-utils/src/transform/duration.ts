import { Duration } from '@scrapper-gate/shared/common';
import { DurationUnit } from '@scrapper-gate/shared/schema';
import { ValueTransformer } from 'typeorm';

export interface DurationRecord {
  value: number;
  unit: DurationUnit;
}

// TODO Create duration by given unit
export const durationTransformer: ValueTransformer = {
  to: (duration?: Duration): DurationRecord | undefined =>
    duration
      ? { unit: duration.enteredUnit, value: duration.valueOf() }
      : undefined,
  from: (record?: DurationRecord) =>
    record ? Duration.fromUnit(record.value, record.unit) : undefined,
};
