import { Descendant } from 'slate';

export interface SerializeStrategy {
  serialize(value: Descendant[]): string | undefined;
  deserialize(value: unknown): Descendant[];
}
