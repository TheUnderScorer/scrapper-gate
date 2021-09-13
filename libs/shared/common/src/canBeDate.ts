export const canBeDate = (value: unknown): value is string | Date =>
  typeof value === 'string' || value instanceof Date;
