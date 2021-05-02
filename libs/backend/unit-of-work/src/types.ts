import { Buses } from 'functional-cqrs/build/typings/buses';

export type UnitOfWorkCallback<ReturnType = unknown> = (
  context: Buses
) => ReturnType | Promise<ReturnType>;
