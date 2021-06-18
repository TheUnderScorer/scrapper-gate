import { wait } from '@scrapper-gate/shared/common';
import { PerformanceManager } from './PerformanceManager';

describe('PerformanceManager', () => {
  it('should measure performance', async () => {
    const manager = new PerformanceManager();

    manager.mark('test-start');

    await wait(1000);

    manager.mark('test-end');
    manager.measure('test', 'test-start', 'test-end');

    const entry = await manager.getEntry('test');
    expect(entry).toBeDefined();
    expect(entry?.duration).toBeGreaterThan(999);
    expect(entry?.duration).toBeLessThan(1200);
  });
});
