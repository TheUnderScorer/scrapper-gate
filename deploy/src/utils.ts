import * as pulumi from '@pulumi/pulumi';
import { first } from 'remeda';
import { Stack } from './types';

export const getStack = () => {
  const stack = pulumi.getStack();

  // This comes from pulumi-local
  if (stack.toLowerCase() === 'localstack') {
    return Stack.Development;
  }

  return first(stack.split('-')) as Stack;
};

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
