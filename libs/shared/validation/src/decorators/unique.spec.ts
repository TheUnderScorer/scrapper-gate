import { JoiMessages } from '../types';
import { string, validateAsClass } from 'joiful';
import { validationMessages } from '../validationMessages';
import { unique } from './unique';

interface Context {
  items: Item[];
}

class Item {
  id: string;

  @(string().custom(
    unique({
      getValueFromContext: (ctx: Context) => ctx.items,
      getValue: (item) => item.key,
      isTarget: (parent, value) => parent.id === value.id,
    })
  ))
  key: string;
}

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

    const item = new Item();

    item.key = 'test';
    item.id = '3';

    const result = validateAsClass(item, Item, {
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

    const item = new Item();

    item.key = 'test123';

    const result = validateAsClass(item, Item, {
      context: {
        items,
      } as Context,
      messages: validationMessages,
    });

    expect(result.error).toBeNull();
  });
});
