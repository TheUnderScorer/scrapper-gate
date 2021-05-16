import { Disposable } from '@scrapper-gate/shared/common';
import {
  performance,
  PerformanceEntry,
  PerformanceObserver,
  PerformanceObserverCallback,
} from 'perf_hooks';

export class PerformanceManager implements Disposable {
  private readonly observer = new PerformanceObserver(this.getCallback());
  private items: PerformanceEntry[] = [];

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

  private getCallback(): PerformanceObserverCallback {
    return (list, observer) => {
      const items = list.getEntries();

      this.items.push(...items);
    };
  }

  getEntry(name: string) {
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
