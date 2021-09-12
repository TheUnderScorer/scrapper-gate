import { mergeEventHandlers } from './mergeEventHandlers';

describe('Merge event handlers', () => {
  it('should merge all handlers', () => {
    const eventHandlers1 = {
      test: [jest.fn(), jest.fn()],
      test1: [jest.fn()],
    };

    const eventHandlers2 = {
      test: [jest.fn()],
      test1: [jest.fn()],
    };

    const result = mergeEventHandlers(eventHandlers1, eventHandlers2);

    expect(result.test).toHaveLength(3);
    expect(result.test).toEqual([
      ...eventHandlers1.test,
      ...eventHandlers2.test,
    ]);
    expect(result.test1).toHaveLength(2);
    expect(result.test1).toEqual([
      ...eventHandlers1.test1,
      ...eventHandlers2.test1,
    ]);
  });
});
