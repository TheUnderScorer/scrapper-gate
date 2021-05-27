import * as validation from '@scrapper-gate/shared/validation';
import { BaseSchemaConstructor } from '@scrapper-gate/shared/validation';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class ValidateDtoDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<unknown, unknown>,
    details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
  ) {
    const { resolve = defaultFieldResolver } = field;

    const { dto, key } = this.args;
    const Schema = validation[dto] as BaseSchemaConstructor<unknown>;

    // eslint-disable-next-line no-prototype-builtins
    if (!validation.BaseSchema.isPrototypeOf(Schema)) {
      throw new TypeError(`Provided DTO ${dto} does not extend BaseSchema.`);
    }

    field.resolve = async (source, args, context, info) => {
      const argToCheck = args[key];

      await Schema.validate(argToCheck, {
        allowUnknown: true,
        abortEarly: true,
      });

      return resolve.call(this, source, args, context, info);
    };
  }
}
