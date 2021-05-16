import { Disposable, wait } from '@scrapper-gate/shared/common';
import {
  performance,
  PerformanceEntry,
  PerformanceObserver,
  PerformanceObserverCallback,
} from 'perf_hooks';

export class PerformanceManager implements Disposable {
  private readonly observer = new PerformanceObserver(this.getCallback());
  private items: PerformanceEntry[] = [];

  // Stores are measured performance marks. Used during dispose
  private readonly marks = new Set<string>();

  constructor() {
    this.observe();
  }

  observe() {
    this.observer.observe({
      entryTypes: ['measure'],
      buffered: true,
    });
  }

  async dispose() {
    this.observer.disconnect();

    Array.from(this.marks).forEach((mark) => {
      performance.clearMarks(mark);
    });

    this.marks.clear();
  }

  // Registers callback for performance observer
  private getCallback(): PerformanceObserverCallback {
    return (list) => {
      const items = list.getEntries();

      this.items.push(...items);
    };
  }

  // Returns performance entry by name
  async getEntry(name: string): Promise<PerformanceEntry | undefined> {
    // Await just in case if entry is not present, if it should be it will be available after this delay
    await wait(500);

    return this.items.find((item) => item.name === name);
  }

  mark(mark: string) {
    performance.mark(mark);

    this.marks.add(mark);
  }

  measure(name: string, start?: string, end?: string) {
    performance.measure(name, start, end);
  }
}
