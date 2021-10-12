import { Constructor } from '@scrapper-gate/shared/constructor';
import type { PartialDeep } from 'type-fest';
import { Dictionary, Jsonable, OmitFunctions } from './types';

export interface DataObjectConstructor<T> extends Constructor<DataObject<T>> {
  create(payload: PartialDeep<OmitFunctions<T>>): T;
}

export abstract class DataObject<Entity> implements Jsonable {
  fill(payload: Partial<Entity>): this {
    Object.assign(this, payload);

    return this;
  }

  clone(): this {
    const instance = new (this.constructor as Constructor<
      DataObject<unknown>
    >)();

    instance.fill(this);

    return instance as this;
  }

  toJSON() {
    return Object.assign({}, this) as Dictionary;
  }

  static create<T extends DataObject<unknown>>(
    this: { new (): T },
    payload: PartialDeep<OmitFunctions<T>>
  ) {
    const entity = new this();

    return entity.fill(payload as T);
  }
}
