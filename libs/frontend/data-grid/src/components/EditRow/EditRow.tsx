import { GridApi } from '@material-ui/data-grid';
import { Box, ClickAwayListener } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { memo, useMemo } from 'react';
import { resolveGridModelFormName } from '../../resolveGridModelFormName';
import { EditRowProps } from './EditRow.types';

const PREFIX = 'EditRow';

const classes = {
  box: `${PREFIX}-box`,
};

const StyledClickAwayListener = styled(ClickAwayListener)(() => ({
  [`& .${classes.box}`]: {
    '& .MuiFormControl-root, & .MuiInputBase-root': {
      width: '100%',
      height: '100%',
    },
  },
}));

const BaseEditRow = ({ api, id, field, name, children }: EditRowProps) => {
  const fullName = useMemo(
    () =>
      resolveGridModelFormName({
        id,
        name,
        field,
        api,
      }),
    [api, field, id, name]
  );

  return (
    <StyledClickAwayListener
      mouseEvent="onMouseDown"
      onClickAway={() => {
        (api as GridApi).setCellMode(id, field, 'view');
      }}
    >
      <Box
        paddingLeft={1}
        paddingRight={1}
        className={classes.box}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        {children({ name: fullName })}
      </Box>
    </StyledClickAwayListener>
  );
};

export const EditRow = memo(BaseEditRow, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.field === nextProps.field &&
    prevProps.value === nextProps.value
  );
});
