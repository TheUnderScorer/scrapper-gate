import { makeStyles } from '@material-ui/core/styles';
import { FlowBuilderSidebar } from './flowBuilderSidebar/FlowBuilderSidebar';
import { FlowBuilderCanvas } from './flowBuilderCanvas/FlowBuilderCanvas';
import { FlowBuilderNodeContent } from './flowBuilderNodeContent/FlowBuilderNodeContent';
import { Stack } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  stack: {
    height: '100%',
  },
}));

export const FlowBuilderContent = () => {
  const classes = useStyles();

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
