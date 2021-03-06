import { Descendant } from 'slate';

export interface SerializeStrategy {
  serialize(value: Descendant[]): string;
  deserialize(value: unknown): Descendant[];
}
