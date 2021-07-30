/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-non-null-assertion */
import { clone } from 'remeda';
import { DataObject } from './DataObject';
import { MaybePromise } from './promise';

type UpdateMap<Entity, Input extends Partial<Entity>> = {
  [Key in keyof Input]?: (
    Entity: Entity,
    input: Input[Key]
  ) => MaybePromise<Entity>;
};

export type PerformUpdateResult<Entity> = {
  result: Entity;
  didUpdate: boolean;
};

type ValidInputProperties<
  Entity,
  Input,
  TUpdateMap extends UpdateMap<Entity, Input>
> = Omit<Input, keyof TUpdateMap>;

export const performUpdate = async <
  Entity,
  Input,
  TUpdateMap extends UpdateMap<Entity, Input>
>(
  entity: Entity,
  input: Input,
  updateMap?: TUpdateMap
): Promise<PerformUpdateResult<Entity>> => {
  const inputKeys = Object.keys(input);

  if (!inputKeys.length) {
    return {
      result: entity,
      didUpdate: false,
    };
  }

  let entityClone =
    entity instanceof DataObject ? entity.clone() : clone(entity);

  for (const key of inputKeys) {
    if (updateMap?.[key as keyof Input]) {
      entityClone = await updateMap[key as keyof Input]!(
        entity,
        (input as any)[key]
      );

      continue;
    }

    (entityClone as any)[key] =
      input[key as keyof ValidInputProperties<Entity, Input, TUpdateMap>];
  }

  return {
    result: entityClone,
    didUpdate: true,
  };
};
