import { makeStyles } from '@material-ui/core/styles';
import { FlowBuilderSidebar } from '../Sidebar/FlowBuilderSidebar';
import { FlowBuilderCanvas } from '../Canvas/FlowBuilderCanvas';
import { FlowBuilderNodeContent } from '../NodeContent/FlowBuilderNodeContent';
import { Stack } from '@material-ui/core';
import { useNodesCreator } from '../hooks/useNodesCreator';

const useStyles = makeStyles(() => ({
  stack: {
    height: '100%',
  },
}));

export const FlowBuilderContent = () => {
  const classes = useStyles();

  // Called here in order to make sure that we have access to whole context
  useNodesCreator();

  return (
    <>
      <Stack direction="row" className={classes.stack}>
        <FlowBuilderSidebar />
        <FlowBuilderCanvas />
      </Stack>

      <FlowBuilderNodeContent />
    </>
  );
};
