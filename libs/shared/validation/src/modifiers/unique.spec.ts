import joi from 'joi';
import { JoiMessages } from '../types';
import { validationMessages } from '../validationMessages';
import { unique } from './unique';

interface Item {
  id: string;
  key: string;
}

interface Context {
  items: Item[];
}

const ItemSchema = joi.object<Item>({
  id: joi.string(),
  key: unique({
    getValuesFromContext: (ctx: Context) => ctx.items,
    getUniqueValue: (item) => item.key,
    isTargetValue: (parent, value) => parent.id === value.id,
    schema: joi.string(),
  }),
});

describe('Unique', () => {
  it('should throw if value is not unique', async () => {
    const items: Item[] = [
      {
        id: '1',
        key: 'test',
      },
      {
        id: '2',
        key: 'test1',
      },
    ];

    const item: Item = {
      key: 'test',
      id: '3',
    };

    const result = ItemSchema.validate(item, {
      context: {
        items,
      } as Context,
      messages: validationMessages,
    });

    expect(result.error?.message).toEqual(
      validationMessages[JoiMessages.Unique]
    );
  });

  it('should not throw if value is unique', async () => {
    const items: Item[] = [
      {
        id: '1',
        key: 'test',
      },
      {
        id: '2',
        key: 'test1',
      },
    ];

    const item: Item = {
      key: 'test123',
      id: '3',
    };

    const result = ItemSchema.validate(item, {
      context: {
        items,
      } as Context,
      messages: validationMessages,
    });

    expect(result.error).toBeFalsy();
  });
});
