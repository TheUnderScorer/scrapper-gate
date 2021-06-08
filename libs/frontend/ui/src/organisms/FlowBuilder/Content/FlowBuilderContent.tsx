import { Stack } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { FlowBuilderCanvas } from '../Canvas/FlowBuilderCanvas';
import { useNodesCreator } from '../hooks/useNodesCreator';
import { FlowBuilderNodeContent } from '../NodeContent/FlowBuilderNodeContent';
import { FlowBuilderSidebar } from '../Sidebar/FlowBuilderSidebar';

const useStyles = makeStyles(() => ({
  stack: {
    height: '100%',
    position: 'relative',
  },
}));

export const FlowBuilderContent = () => {
  const classes = useStyles();

  // Called here in order to make sure that we have access to whole context
  useNodesCreator();

  return (
    <Stack direction="row" className={classes.stack}>
      <FlowBuilderSidebar />
      <FlowBuilderCanvas />
      <FlowBuilderNodeContent />
    </Stack>
  );
};
