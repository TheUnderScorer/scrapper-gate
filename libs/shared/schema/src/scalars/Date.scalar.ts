import { isDate } from 'date-fns';
import { GraphQLScalarType, Kind } from 'graphql';

export const dateScalarSupportedKinds: string[] = [
  Kind.STRING,
  Kind.INT,
  Kind.FLOAT,
];

export const DateScalar = new GraphQLScalarType({
  name: 'Date',
  serialize: (value?: Date) => {
    console.log({ value });
    return isDate(value) ? value?.toISOString() : value;
  },
  parseValue: (value) => (value ? new Date(value) : value),
  parseLiteral: (ast) => {
    if (dateScalarSupportedKinds.includes(ast.kind)) {
      return new Date((ast as unknown as Record<string, string>).value);
    }

    return null;
  },
});
