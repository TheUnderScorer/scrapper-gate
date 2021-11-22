import { Constructor } from '@scrapper-gate/shared/constructor';
import {
  Clonable,
  Dictionary,
  Jsonable,
  OmitFunctions,
} from '@scrapper-gate/shared/data-structures';
import { filter, pipe, reduce } from 'remeda';
import type { PartialDeep } from 'type-fest';

export interface DataObjectConstructor<T> extends Constructor<DataObject<T>> {
  create(payload: PartialDeep<OmitFunctions<T>>): T;
}

export abstract class DataObject<Entity> implements Jsonable, Clonable {
  protected readonly = false;

  fill(payload: PartialDeep<Entity>): this {
    if (!this.readonly) {
      Object.assign(this, payload);
    }

    return this;
  }

  clone(): this {
    const instance = new (this.constructor as Constructor<
      DataObject<unknown>
    >)();

    instance.fill(this);

    instance.readonly = this.readonly;

    return instance as this;
  }

  toJSON() {
    const initialKeys = [
      ...Object.keys(this),
      ...Object.keys(Object.getPrototypeOf(this)),
    ];

    return pipe(
      initialKeys,
      filter((key) => typeof this[key as keyof this] !== 'function'),
      reduce((acc, key) => {
        return {
          ...acc,
          [key]: this[key as keyof this],
        };
      }, {})
    ) as Dictionary;
  }

  static create<T extends DataObject<unknown>>(
    this: { new (): T },
    payload: PartialDeep<OmitFunctions<T>>
  ) {
    const entity = new this();
    const readonly = entity.readonly;

    entity.readonly = false;

    entity.fill(payload as T);

    entity.readonly = readonly;

    return entity;
  }
}
