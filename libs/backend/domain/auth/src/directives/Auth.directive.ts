import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { UnauthorizedError } from '@scrapper-gate/shared/errors';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<unknown, unknown>,
    details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
  ) {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = (source, args, context, info) => {
      if (!(context as BaseApolloContext).user) {
        throw new UnauthorizedError();
      }

      return resolve.call(this, source, args, context, info);
    };
  }
}
