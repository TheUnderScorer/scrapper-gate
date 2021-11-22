import { useVariablesContextSelector } from '@scrapper-gate/frontend/domain/variables';
import { createContext, PropsWithChildren, useContext } from 'react';

export interface ConditionalRulesContext<Ctx> {
  context: Ctx;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Context = createContext<ConditionalRulesContext<any>>({
  context: {},
});

export const useConditionalRulesContext = <Ctx extends unknown>() =>
  useContext(Context) as ConditionalRulesContext<Ctx>;

export const ConditionalRulesContextProvider = <
  Ctx extends Record<string, unknown>
>({
  context,
  children,
}: PropsWithChildren<ConditionalRulesContext<Ctx>>) => {
  const variables = useVariablesContextSelector((ctx) => ctx.variables);

  return (
    <Context.Provider
      value={{
        context: {
          ...context,
          variables: context.variables ?? variables,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};
