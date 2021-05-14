import React, { PropsWithChildren, useState } from 'react';
import {
  createContext,
  useContext,
  useContextSelector,
} from 'use-context-selector';

export interface FlowBuilderActiveNodeContext {
  activeNodeId?: string;
  setActiveNodeId: (node: string | undefined) => unknown;
  contentOpen: boolean;
  setContentOpen: (open: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Context = createContext<FlowBuilderActiveNodeContext>({} as any);

export const useFlowBuilderActiveNode = () => useContext(Context);
export const useFlowBuilderActiveNodeSelector = <Value extends unknown>(
  selector: (ctx: FlowBuilderActiveNodeContext) => Value
) => useContextSelector(Context, selector);

export const FlowBuilderActiveNodeProvider = ({
  children,
}: PropsWithChildren<unknown>) => {
  const [activeNodeId, setActiveNodeId] = useState<string | undefined>();
  const [contentOpen, setContentOpen] = useState(false);

  return (
    <Context.Provider
      value={{ activeNodeId, setActiveNodeId, contentOpen, setContentOpen }}
    >
      {children}
    </Context.Provider>
  );
};
