import { Chip, ChipProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ComponentType } from 'react';

export const PrimaryLightChip: ComponentType<ChipProps> = styled(Chip)(
  ({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,
  })
);

PrimaryLightChip.defaultProps = {
  color: 'primary',
};
