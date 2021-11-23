import { GraphQLScalarType, Kind } from 'graphql';

export const RecordScalar = new GraphQLScalarType({
  name: 'Record',
  parseValue: (value) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return JSON.parse(ast.value);
    }

    return null;
  },
});
