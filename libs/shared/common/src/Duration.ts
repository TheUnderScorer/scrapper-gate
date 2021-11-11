import { Clonable, WithValue } from '@scrapper-gate/shared/data-structures';
import {
  Duration as DurationType,
  DurationInput,
  DurationUnit,
  Maybe,
} from '@scrapper-gate/shared/schema';
import { filter, map, pipe } from 'remeda';

export class Duration implements WithValue<number>, DurationType, Clonable {
  private readonly msValue: number;

  private unit: DurationUnit;

  private constructor(msValue: number, unit: DurationUnit) {
    this.msValue = Number.isNaN(msValue) ? 0 : msValue;
    this.unit = unit;
  }

  get ms() {
    return this.msValue;
  }

  get seconds() {
    return this.msValue / 1000;
  }

  get minutes() {
    return this.seconds / 60;
  }

  get hours() {
    return this.minutes / 60;
  }

  get enteredUnit() {
    return this.unit;
  }

  byUnit(unit: DurationUnit) {
    return Duration.retrieveValueFromDuration({
      ...this.toJSON(),
      enteredUnit: unit,
    });
  }

  modify(value: number) {
    return Duration.fromUnit(value, this.unit);
  }

  toInput(): DurationInput {
    return {
      value: this.valueOf(),
      unit: this.enteredUnit,
    };
  }

  valueOf() {
    return this.byUnit(this.enteredUnit);
  }

  clone() {
    return new Duration(this.msValue, this.unit) as this;
  }

  toJSON(): DurationType {
    return {
      ms: this.ms,
      hours: this.hours,
      minutes: this.minutes,
      seconds: this.seconds,
      enteredUnit: this.enteredUnit,
    };
  }

  private static retrieveValueFromDuration(duration: DurationType) {
    switch (duration.enteredUnit) {
      case DurationUnit.Milliseconds:
        return duration.ms;

      case DurationUnit.Seconds:
        return duration.seconds;

      case DurationUnit.Minutes:
        return duration.minutes;

      case DurationUnit.Hours:
        return duration.hours;

      default:
        throw new TypeError('Invalid unit provided.');
    }
  }

  static fromInput(input: DurationInput) {
    return this.fromUnit(input.value, input.unit);
  }

  static fromUnit(value: number, unit: DurationUnit) {
    switch (unit) {
      case DurationUnit.Milliseconds:
        return this.fromMs(value);

      case DurationUnit.Seconds:
        return this.fromSeconds(value);

      case DurationUnit.Minutes:
        return this.fromMinutes(value);

      case DurationUnit.Hours:
        return this.fromHours(value);

      default:
        throw new TypeError('Invalid unit provided.');
    }
  }

  static fromDuration(duration: DurationType) {
    const value = this.retrieveValueFromDuration(duration);

    return this.fromUnit(value, duration.enteredUnit);
  }

  static fromDurationRecords<T extends Record<string, Maybe<DurationType>>>(
    record: T
  ): {
    [Key in keyof T]: T[Key] extends undefined | null ? never : Duration;
  } {
    return pipe(
      Object.entries(record),
      filter(([, value]) => Boolean(value)),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      map(([key, value]) => [key, this.fromDuration(value!)]),
      Object.fromEntries
    );
  }

  static fromDurationRecordsToInput<
    T extends Record<string, Maybe<DurationType>>
  >(
    record: T
  ): {
    [Key in keyof T]: T[Key] extends undefined | null
      ? undefined
      : DurationInput;
  } {
    return pipe(
      Object.entries(this.fromDurationRecords(record)),
      map(([key, val]) => [key, val.toInput()]),
      Object.fromEntries
    );
  }

  static fromMs(ms: number) {
    return new this(ms, DurationUnit.Milliseconds);
  }

  static fromSeconds(seconds: number) {
    return new this(seconds * 1000, DurationUnit.Seconds);
  }

  static fromMinutes(minutes: number) {
    const duration = this.fromSeconds(minutes * 60);

    duration.unit = DurationUnit.Minutes;

    return duration;
  }

  static fromHours(hours: number) {
    const result = this.fromMinutes(hours * 60);

    result.unit = DurationUnit.Hours;

    return result;
  }
}
