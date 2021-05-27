import { repeat } from './repeat';

describe('Repeat', () => {
  it('should repeat callback defined number of times', async () => {
    const fn = jest.fn();

    await repeat(3, fn);

    expect(fn).toHaveBeenCalledTimes(3);
  });
});
