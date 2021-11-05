import { DurationUnit } from '@scrapper-gate/shared/schema';
import { Duration } from './Duration';

type TestCase = [duration: Duration, expected: number];

describe('Duration', () => {
  it.each<TestCase>([
    [Duration.fromMs(60), 60],
    [Duration.fromSeconds(10), 10_000],
    [Duration.fromMinutes(1), 60_000],
    [Duration.fromHours(1), 3_600_000],
  ])('should return correct duration as ms', (duration, expected) => {
    expect(duration.ms).toEqual(expected);
  });

  it.each<TestCase>([
    [Duration.fromMs(10_000), 10],
    [Duration.fromSeconds(10), 10],
    [Duration.fromMinutes(1), 60],
    [Duration.fromHours(1), 3600],
  ])('should return correct duration as second', (duration, expected) => {
    expect(duration.seconds).toEqual(expected);
  });

  it.each<TestCase>([
    [Duration.fromMs(60_000), 1],
    [Duration.fromSeconds(60), 1],
    [Duration.fromMinutes(1), 1],
    [Duration.fromHours(1), 60],
  ])('should return correct duration as minute', (duration, expected) => {
    expect(duration.minutes).toEqual(expected);
  });

  it.each<TestCase>([
    [Duration.fromMs(3_600_000), 1],
    [Duration.fromSeconds(3600), 1],
    [Duration.fromMinutes(60), 1],
    [Duration.fromHours(1), 1],
  ])('should return correct duration as hour', (duration, expected) => {
    expect(duration.hours).toEqual(expected);
  });

  it('should return value as ms', () => {
    expect(Duration.fromMs(60).valueOf()).toEqual(60);
  });

  it('should store entered unit', () => {
    const duration = Duration.fromHours(1);

    expect(duration.enteredUnit).toEqual(DurationUnit.Hours);
  });

  it('should create from unit', () => {
    const duration = Duration.fromUnit(60, DurationUnit.Minutes);

    expect(duration.hours).toEqual(1);
  });

  it('should get value by unit', () => {
    const duration = Duration.fromMinutes(60);

    expect(duration.byUnit(DurationUnit.Hours)).toEqual(1);
  });
});
