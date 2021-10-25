import * as pulumi from '@pulumi/pulumi';
import { Stack } from './types';

export const getStack = () => pulumi.getStack() as Stack;

export const createItemName = (name: string) => `${getStack()}-${name}`;

const onlyOnEnv = <T>(callback: () => T, stacks: Stack[]) => {
  if (!stacks.includes(getStack())) {
    return undefined;
  }

  return callback();
};

export const onlyOnRealEnv = <T>(callback: () => T): T | undefined =>
  onlyOnEnv(callback, [Stack.Staging, Stack.Production]);

export const onlyOnLocalEnv = <T>(callback: () => T): T | undefined =>
  onlyOnEnv(callback, [Stack.Development]);
