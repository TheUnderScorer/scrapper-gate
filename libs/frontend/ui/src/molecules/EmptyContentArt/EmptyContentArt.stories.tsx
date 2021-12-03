import { Box } from '@mui/material';
import { action } from '@storybook/addon-actions';
import { EmptyContentArt } from './EmptyContentArt';

export default {
  title: 'Molecules/EmptyContentArt',
};

export const Component = () => {
  return (
    <Box width={500} height={500}>
      <EmptyContentArt
        createText="Create stuff"
        onCreate={action('create')}
        title="Whoops, nothing was found!"
        subTitle="Maybe create something first?"
      />
    </Box>
  );
};
