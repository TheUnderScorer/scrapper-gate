import { Buses } from 'functional-cqrs';

export type UnitOfWorkCallback<
  ReturnType = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Context extends Buses<any, any> = Buses<any, any>
> = (context: Context) => ReturnType | Promise<ReturnType>;
