import * as validation from '@scrapper-gate/shared/validation';
import { validate } from '@scrapper-gate/shared/validation';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
import { isSchema } from 'joi';

export class ValidateDtoDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<unknown, unknown>,
    details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
  ) {
    const { resolve = defaultFieldResolver } = field;

    const { schema, key } = this.args;
    const Schema = (validation as Record<string, unknown>)[schema];

    if (!isSchema(Schema)) {
      throw new TypeError(
        `Provided schema ${schema} is not a valid validation schema.`
      );
    }

    field.resolve = async (source, args, context, info) => {
      const argToCheck = args[key];

      validate(argToCheck, Schema, {
        allowUnknown: true,
        abortEarly: true,
        context: argToCheck,
      });

      return resolve.call(this, source, args, context, info);
    };
  }
}
