import { FabProps, Fab as BaseFab } from '@mui/material';

export const Fab = ({ color, ...rest }: FabProps) => {
  return (
    <BaseFab
      {...rest}
      color={color === 'primaryLight' ? 'primary' : color}
      sx={{
        ...rest.sx,
        ...(color === 'primaryLight'
          ? {
              '&.MuiFab-root, &.MuiFab-root:hover': {
                color: (theme) => theme.palette.primary.dark,
                backgroundColor: (theme) => theme.palette.primary.light,
              },
            }
          : {}),
      }}
    />
  );
};
