import { Stack } from '@mui/material';
import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { FlowBuilderCanvas } from '../Canvas/FlowBuilderCanvas';
import { FlowBuilderProps } from '../FlowBuilder.types';
import { useNodesCreatorHandler } from '../hooks/useNodesCreatorHandler';
import { useRefHandler } from '../hooks/useRefHandler';
import { FlowBuilderNodeContent } from '../Node/Content/FlowBuilderNodeContent';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { FlowBuilderSidebar } from '../Sidebar/FlowBuilderSidebar';

export type FlowBuilderContentProps = Pick<FlowBuilderProps, 'apiRef'> &
  ThemedSxProps;

export const FlowBuilderContent = (props: FlowBuilderContentProps) => {
  const readOnly = useFlowBuilderContextSelector((ctx) => ctx.readOnly);

  // Called here in order to make sure that we have access to whole context
  useNodesCreatorHandler();

  useRefHandler(props.apiRef);

  return (
    <Stack
      direction="row"
      sx={{
        height: '100%',
        position: 'relative',
        ...props.sx,
      }}
    >
      {!readOnly && <FlowBuilderSidebar />}
      <FlowBuilderCanvas />
      <FlowBuilderNodeContent />
    </Stack>
  );
};
