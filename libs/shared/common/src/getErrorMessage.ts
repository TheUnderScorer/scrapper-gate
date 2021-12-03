import { isError } from './typeGuards/isError';

export const getErrorMessage = (error: unknown) =>
  isError(error) ? error.message : JSON.stringify(error);
