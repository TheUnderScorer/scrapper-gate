import { logger } from '@scrapper-gate/shared/logger/console';
import { Descendant, Node } from 'slate';
import { SerializeStrategy } from '../types';

export const textSerializeStrategy: SerializeStrategy = {
  serialize(value: Descendant[]): string {
    logger.debug('Serialize:', value);

    return value.map((value) => Node.string(value)).join('\n');
  },
  deserialize(value: string): Descendant[] {
    const result = value.split('\n').map((value) => ({
      type: 'text',
      children: [{ text: value }],
    }));

    logger.debug('Deserialize:', result);

    return result;
  },
};
