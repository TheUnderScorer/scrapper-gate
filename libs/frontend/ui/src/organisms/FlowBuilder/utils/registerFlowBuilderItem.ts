/* eslint-disable @typescript-eslint/ban-ts-comment */
import { UseFormRegister } from 'react-hook-form';
import {
  BaseNodeProperties,
  FlowBuilderFormState,
  FlowBuilderItem,
} from '@scrapper-gate/frontend/ui';
import { forEachObj } from 'remeda';

export const registerFlowBuilderItem = (
  register: UseFormRegister<FlowBuilderFormState>,
  item: FlowBuilderItem<BaseNodeProperties>,
  index: number
) => {
  console.log({ item });
  forEachObj.indexed(item, (value, key) => {
    if (key === 'data') {
      return;
    }

    console.log({ value, key });

    // @ts-ignore
    register(`items.${index}.${key}`);
  });

  forEachObj.indexed(item.data, (value, key) => {
    // @ts-ignore
    register(`items.${index}.data.${key}`);
  });
};
