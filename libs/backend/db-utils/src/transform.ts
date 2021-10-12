import {
  DataObject,
  DataObjectConstructor,
  OmitFunctions,
} from '@scrapper-gate/shared/common';
import { PartialDeep } from 'type-fest';
import { ValueTransformer } from 'typeorm';

export const makeDataObjectTransformer = <
  Obj extends unknown,
  TDataObject extends DataObjectConstructor<Obj>
>(
  DataObject: TDataObject
): ValueTransformer => ({
  from: (value?: PartialDeep<OmitFunctions<Obj>>) =>
    value ? DataObject.create(value) : undefined,
  to: (value?: DataObject<Obj>) => value?.toJSON(),
});

export const makeDataObjectArrayTransformer = <
  Obj extends unknown,
  TDataObject extends DataObjectConstructor<Obj>
>(
  DataObject: TDataObject
): ValueTransformer => ({
  from: (value?: PartialDeep<OmitFunctions<Obj>>[]) =>
    value ? value.map((val) => DataObject.create(val)) : undefined,
  to: (value?: DataObject<Obj>[]) => value?.map((val) => val.toJSON()),
});
