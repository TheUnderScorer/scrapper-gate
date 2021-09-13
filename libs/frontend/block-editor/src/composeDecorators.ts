import { NodeEntry, Range } from 'slate';
import { Decorator } from './Decorator';

export const composeDecorators =
  (decorators: Decorator[]) => (entry: NodeEntry) =>
    decorators.reduce<Range[]>(
      (acc, decorator) => decorator.decorate(entry, acc),
      []
    );
