import { setRefValue } from '@scrapper-gate/frontend/common';
import { useEffect } from 'react';
import { FlowBuilderProps } from '../FlowBuilder.types';
import { useNodesCreator } from './useNodesCreator';

export const useRefHandler = (ref?: FlowBuilderProps['apiRef']) => {
  const nodesCreator = useNodesCreator();

  useEffect(() => {
    if (!ref) {
      return;
    }

    setRefValue(ref, {
      nodesCreator,
    });
  }, [nodesCreator, ref]);
};
