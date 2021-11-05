import { renderHook } from '@testing-library/react-hooks';
import { useCodeRunner } from './useCodeRunner';

describe('Use code runner', () => {
  it('should run code', async () => {
    const hook = renderHook(() =>
      useCodeRunner({
        code: 'return 2+number',
        additionalConstants: {
          number: 2,
        },
      })
    );

    const result = await hook.result.current.run();

    expect(result).toEqual(4);
  });

  it('should store last error', async () => {
    const hook = renderHook(() =>
      useCodeRunner({
        code: 'return 2+number',
      })
    );

    await hook.result.current.run();

    expect(hook.result.current.lastError).toBeDefined();
    expect(hook.result.current.lastError?.message).toEqual(
      'number is not defined'
    );
  });
});
