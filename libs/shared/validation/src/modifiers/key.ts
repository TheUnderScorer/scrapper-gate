import joi, { StringSchema } from 'joi';
import { pipe } from 'remeda';
import { noSpecialChars } from './noSpecialChars';
import { unique, UniqueParams } from './unique';

export const keyField = <Context, ValueFromContext>(
  uniqueParams: Omit<
    UniqueParams<Context, ValueFromContext, StringSchema>,
    'schema'
  >
) =>
  pipe(
    joi.string().max(50).required(),
    (schema) => noSpecialChars({ schema }),
    (schema) =>
      unique({
        ...uniqueParams,
        schema,
      })
  );
