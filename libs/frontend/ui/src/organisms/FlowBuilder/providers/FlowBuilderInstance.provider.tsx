import React, { createContext, FC, useContext, useMemo, useState } from 'react';
import { OnLoadParams } from 'react-flow-renderer';

export interface FlowBuilderInstanceContext {
  flowInstance?: OnLoadParams;
  setFlowInstance?: (params: OnLoadParams) => any;
}

const Context = createContext<FlowBuilderInstanceContext>({} as any);

export const useFlowBuilderInstanceContext = () => useContext(Context);

export const FlowBuilderInstanceProvider: FC = ({ children }) => {
  const [flowInstance, setFlowInstance] = useState<OnLoadParams | undefined>();

  const state = useMemo<FlowBuilderInstanceContext>(
    () => ({
      flowInstance,
      setFlowInstance,
    }),
    [flowInstance]
  );

  return <Context.Provider value={state}>{children}</Context.Provider>;
};
