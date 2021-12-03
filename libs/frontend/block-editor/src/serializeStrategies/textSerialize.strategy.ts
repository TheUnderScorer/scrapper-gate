import { getEmptyValue } from '../getEmptyValue';
import { DateFormat } from '@scrapper-gate/shared/common';
import { logger } from '@scrapper-gate/shared/logger/console';
import { format, isValid } from 'date-fns';
import { Descendant, Node } from 'slate';
import { SerializeStrategy } from '../types';

export const createTextSerializeStrategy = (
  dateFormat = DateFormat.DateTime
): SerializeStrategy => ({
  serialize(value: Descendant[]): string | undefined {
    const result = value.map((value) => Node.string(value)).join('\n');

    logger.debug('Serialize:', {
      value,
      result,
    });

    return result || undefined;
  },
  deserialize(value: unknown): Descendant[] {
    if (!value) {
      return [];
    }

    const isDate = value instanceof Date;

    if (isDate && !isValid(value)) {
      return getEmptyValue();
    }

    const parsedValue = isDate ? format(value, dateFormat) : value;

    if (typeof parsedValue !== 'string') {
      return getEmptyValue();
    }

    const result = parsedValue.split('\n').map((value) => ({
      type: 'text',
      children: [{ text: value }],
    }));

    logger.debug('Deserialize:', result);

    return result;
  },
});
