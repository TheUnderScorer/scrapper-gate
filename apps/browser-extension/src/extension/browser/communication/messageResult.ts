import { MessageResult } from './messageResult.types';

export const errorMessageResult = <Result>(
  error: Error
): MessageResult<Result> => ({
  error,
  result: false,
});

export const successMessageResult = <Result>(
  result?: Result
): MessageResult<Result> => ({
  payload: result,
  result: true,
});
