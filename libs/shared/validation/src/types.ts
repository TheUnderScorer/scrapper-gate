import { AnySchema } from 'joi';

export enum JoiMessages {
  Required = 'any.required',
  Email = 'string.email',
  Only = 'any.only',
  Uri = 'string.uri',
  NoSpecialChars = 'string.noSpecialChars',
  HtmlAttribute = 'string.htmlAttribute',
  Custom = 'any.custom',
  Number = 'number.base',
  String = 'string.base',
  Date = 'date.base',
  Empty = 'string.empty',
  Unique = 'any.unique',
  InvalidConditionalRule = 'InvalidConditionalRule',
}

export interface SchemaModifierParams<Schema extends AnySchema = AnySchema> {
  schema: Schema;
}
