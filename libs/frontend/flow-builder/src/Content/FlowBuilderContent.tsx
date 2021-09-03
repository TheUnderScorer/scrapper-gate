import { Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { FlowBuilderCanvas } from '../Canvas/FlowBuilderCanvas';
import { FlowBuilderProps } from '../FlowBuilder.types';
import { useNodesCreatorHandler } from '../hooks/useNodesCreatorHandler';
import { useRefHandler } from '../hooks/useRefHandler';
import { FlowBuilderNodeContent } from '../Node/Content/FlowBuilderNodeContent';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { FlowBuilderSidebar } from '../Sidebar/FlowBuilderSidebar';

const useStyles = makeStyles(() => ({
  stack: {
    height: '100%',
    position: 'relative',
  },
}));

export const FlowBuilderContent = (props: Pick<FlowBuilderProps, 'apiRef'>) => {
  const classes = useStyles();

  const readOnly = useFlowBuilderContextSelector((ctx) => ctx.readOnly);

  // Called here in order to make sure that we have access to whole context
  useNodesCreatorHandler();

  useRefHandler(props.apiRef);

  return (
    <Stack direction="row" className={classes.stack}>
      {!readOnly && <FlowBuilderSidebar />}
      <FlowBuilderCanvas />
      <FlowBuilderNodeContent />
    </Stack>
  );
};
