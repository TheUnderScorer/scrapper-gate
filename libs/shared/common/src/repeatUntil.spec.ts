import { OperationTimeoutError } from '@scrapper-gate/shared/errors';
import { repeatUntil } from './repeatUntil';

describe('Repeat until', () => {
  it('should repeat function until desired result', async () => {
    const handler = jest.fn((iteration: number) => iteration);
    const checker = jest.fn((value: number) => value > 2);

    const result = await repeatUntil(handler, checker);

    expect(result).toEqual(3);
  });

  it('should return last error if no checker was provided', async () => {
    const error = new Error('test');

    const handler = jest.fn(() => {
      throw error;
    });

    await expect(repeatUntil(handler, undefined, 1000)).rejects.toThrow(error);
  });

  it('should timeout', async () => {
    await expect(() => repeatUntil(jest.fn(), jest.fn(), 1000)).rejects.toThrow(
      OperationTimeoutError
    );
  });
});
