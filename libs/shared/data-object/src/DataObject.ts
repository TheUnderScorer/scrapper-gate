import type { Constructor } from '@scrapper-gate/shared/constructor';
import type {
  Clonable,
  Dictionary,
  Jsonable,
  OmitFunctions,
} from '@scrapper-gate/shared/data-structures';
import { Maybe } from '@scrapper-gate/shared/schema';
import { filter, pipe, reduce } from 'remeda';
import type { PartialDeep, Primitive } from 'type-fest';

export type DataObjectPayload<T> = T extends Primitive | Maybe<Primitive> | Date
  ? T
  : {
      // Object case
      // eslint-disable-next-line @typescript-eslint/ban-types
      [Key in keyof OmitFunctions<T>]: T[Key] extends object // Object case
        ? DataObjectPayload<Partial<T[Key]>>
        : T[Key] extends Array<infer S>
        ? DataObjectPayload<Partial<S>>[] // Array case
        : T[Key] extends Maybe<infer S>
        ? Maybe<DataObjectPayload<Partial<S>>> // Maybe case
        : Partial<T[Key]>; // Rest case
    };

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
    payload: Partial<DataObjectPayload<T>>
  ) {
    const entity = new this();
    const readonly = entity.readonly;

    entity.readonly = false;

    entity.fill(payload);

    entity.readonly = readonly;

    return entity;
  }
}
