import {
  DateScalar,
  dateScalarSupportedKinds,
} from '@scrapper-gate/shared/schema';
import { containsVariableKey } from '../containsVariableKey';
import { GraphQLScalarType } from 'graphql';

export const DateOrVariableKeyScalar = new GraphQLScalarType({
  name: 'DateOrVariableKey',
  serialize: DateScalar.serialize,
  parseValue: (value) => {
    if (containsVariableKey(value)) {
      return value;
    }

    return new Date(value);
  },
  parseLiteral(ast) {
    if (dateScalarSupportedKinds.includes(ast.kind)) {
      const astValue = ast as unknown as Record<string, string>;

      return this.parseValue?.(astValue);
    }
  },
});
