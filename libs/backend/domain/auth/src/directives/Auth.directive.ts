import { SchemaDirectiveVisitor } from 'graphql-tools';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLInterfaceType,
  GraphQLObjectType,
} from 'graphql';
import { BaseApolloContext } from '@scrapper-gate/backend/server';
import { UnauthorizedError } from '@scrapper-gate/shared/errors';

export class AuthDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<unknown, unknown>,
    details: { objectType: GraphQLObjectType | GraphQLInterfaceType }
  ): GraphQLField<unknown, unknown> | void | null {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = (source, args, context: BaseApolloContext, info) => {
      if (!context.user) {
        throw new UnauthorizedError();
      }

      return resolve.call(this, source, args, context, info);
    };
  }
}
