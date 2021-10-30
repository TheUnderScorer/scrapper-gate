import { ScrapperBuilderNodeProperties } from '@scrapper-gate/frontend/domain/scrapper';
import { FlowBuilderItem } from '@scrapper-gate/frontend/flow-builder';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { Node } from 'react-flow-renderer';
import { PartialDeep } from 'type-fest';
import { v4 } from 'uuid';
import { canUseUrlFromPrevStep } from './canUseUrlFromPrevStep';

describe('Can use url from prev step', () => {
  it.each<
    [
      items: () => PartialDeep<
        FlowBuilderItem<ScrapperBuilderNodeProperties>
      >[],
      itemIndexToUse: number,
      expectedResult: boolean
    ]
  >([
    [
      () => {
        const items: PartialDeep<
          FlowBuilderItem<ScrapperBuilderNodeProperties>
        >[] = [
          {
            id: v4(),
            data: {
              key: 'test',
              action: ScrapperAction.Click,
              isFirst: true,
              url: faker.internet.url(),
            },
          },
          {
            id: v4(),
            data: {
              key: 'test1',
            },
          },
        ];

        items.push({
          id: v4(),
          source: items[0].id,
          target: items[1].id,
        });

        return items;
      },
      1,
      true,
    ],
    [
      () => {
        const items: PartialDeep<
          FlowBuilderItem<ScrapperBuilderNodeProperties>
        >[] = [
          {
            id: v4(),
            data: {
              key: 'test',
              action: ScrapperAction.Click,
              isFirst: true,
            },
          },
          {
            id: v4(),
            data: {
              key: 'test1',
            },
          },
        ];

        items.push({
          id: v4(),
          source: items[0].id,
          target: items[1].id,
        });

        return items;
      },
      1,
      false,
    ],
  ])(
    'should return true if any previous connected step has url',
    (itemsFn, itemIndexToUse, expectedResult) => {
      const items = itemsFn();

      const result = canUseUrlFromPrevStep(
        items[itemIndexToUse] as Node<ScrapperBuilderNodeProperties>,
        items as FlowBuilderItem<ScrapperBuilderNodeProperties>[]
      );

      expect(result).toEqual(expectedResult);
    }
  );

  it('should return true if initial url is set', () => {
    const result = canUseUrlFromPrevStep(
      {} as Node<ScrapperBuilderNodeProperties>,
      [] as FlowBuilderItem<ScrapperBuilderNodeProperties>[],
      faker.internet.url()
    );

    expect(result).toEqual(true);
  });
});
