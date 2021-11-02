export const isError = (value: unknown): value is Error =>
  Boolean(value && value instanceof Error);
