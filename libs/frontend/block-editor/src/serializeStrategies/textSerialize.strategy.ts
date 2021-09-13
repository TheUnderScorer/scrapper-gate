import { DateFormat } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { format } from 'date-fns';
import { Descendant, Node } from 'slate';
import { SerializeStrategy } from '../types';

export const textSerializeStrategy: SerializeStrategy = {
  serialize(value: Descendant[]): string {
    logger.debug('Serialize:', value);

    return value.map((value) => Node.string(value)).join('\n');
  },
  deserialize(value: unknown): Descendant[] {
    if (!value) {
      return [];
    }

    // TODO Support other date formats?
    const parsedValue =
      value instanceof Date ? format(value, DateFormat.DateTime) : value;

    if (typeof parsedValue !== 'string') {
      return [];
    }

    const result = parsedValue.split('\n').map((value) => ({
      type: 'text',
      children: [{ text: value }],
    }));

    logger.debug('Deserialize:', result);

    return result;
  },
};
