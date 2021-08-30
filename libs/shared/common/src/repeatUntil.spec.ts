import { OperationTimeoutError } from '@scrapper-gate/shared/errors';
import { repeatUntil } from './repeatUntil';

describe('Repeat until', () => {
  it('should repeat function until desired result', async () => {
    const handler = jest.fn((iteration: number) => iteration);
    const checker = jest.fn((value: number) => value > 2);

    const result = await repeatUntil(handler, checker);

    expect(result).toEqual(3);
  });

  it('should timeout', async () => {
    await expect(() => repeatUntil(jest.fn(), jest.fn(), 1000)).rejects.toThrow(
      OperationTimeoutError
    );
  });
});
