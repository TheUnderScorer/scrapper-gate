import { Chip, ChipProps } from '@material-ui/core';
import { styled } from '@material-ui/styles';
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
