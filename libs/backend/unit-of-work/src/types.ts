import { Buses } from 'functional-cqrs/build/typings/buses';

export interface UnitOfWorkCallbackContext extends Buses {}

export type UnitOfWorkCallback<ReturnType = any> = (
  context: UnitOfWorkCallbackContext
) => ReturnType | Promise<ReturnType>;
