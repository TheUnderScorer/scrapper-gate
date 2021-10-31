import { BaseEntity } from '@scrapper-gate/shared/schema';

/**
 * Basing on given input and existing entities, find entities that are not give in input, which means the they should be deleted.
 * */
export const findEntitiesToRemove = <
  Input extends Pick<Partial<BaseEntity>, 'id'>,
  Entity extends Pick<BaseEntity, 'id'>
>(
  input: Input[],
  existingEntities: Entity[]
) => {
  const inputIds = input.map((item) => item.id);

  return existingEntities.filter((entity) => !inputIds.includes(entity.id));
};
