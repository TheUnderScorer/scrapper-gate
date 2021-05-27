import { isDate } from 'date-fns';
import { GraphQLScalarType, Kind } from 'graphql';

const supportedKinds: string[] = [Kind.STRING, Kind.INT, Kind.FLOAT];

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  serialize: (value?: Date) => (isDate(value) ? value.toISOString() : value),
  parseValue: (value) => (value ? new Date(value) : value),
  parseLiteral: (ast) => {
    if (supportedKinds.includes(ast.kind)) {
      return new Date(((ast as unknown) as Record<string, string>).value);
    }

    return null;
  },
});
