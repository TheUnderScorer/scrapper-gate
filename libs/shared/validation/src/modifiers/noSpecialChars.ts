import { containsVariableKey } from '@scrapper-gate/shared/domain/variables';
import joi, { AnySchema } from 'joi';
import { JoiMessages, SchemaModifierParams } from '../types';

export interface NoSpecialCharsParams<Schema extends AnySchema>
  extends SchemaModifierParams<Schema> {
  supportsVariables?: boolean;
}

// Note: in date group we should validate if selected variable type is "Date"
export const noSpecialChars = <Schema extends AnySchema>({
  supportsVariables,
  schema,
}: NoSpecialCharsParams<Schema>) =>
  schema.custom((value, helpers) => {
    if (!value) {
      return value;
    }

    const regex =
      supportsVariables && containsVariableKey(value)
        ? /^(\d|\w|{|})+$/
        : /^(\d|\w)+$/;

    const result = joi.string().regex(regex).validate(value);

    if (result.error) {
      return helpers.error(JoiMessages.NoSpecialChars);
    }

    return value;
  });
