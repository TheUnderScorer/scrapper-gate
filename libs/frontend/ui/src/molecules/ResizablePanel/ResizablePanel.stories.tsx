import { Box, Paper } from '@mui/material';
import { ResizablePanel } from './ResizablePanel';

export default {
  title: 'Molecules/Resizable Panel',
};

export const Component = () => {
  return (
    <Box padding={1} width="900px" height="400px" display="flex">
      <ResizablePanel
        initialWidth={300}
        minWidth={50}
        maxWidth={500}
        enable={{
          right: true,
        }}
      >
        Resize me!
      </ResizablePanel>
      <Paper
        style={{
          flex: 1,
          padding: '10px',
        }}
      >
        Resize me!
      </Paper>
    </Box>
  );
};
