import { Box, ClickAwayListener } from '@material-ui/core';
import { GridApi } from '@material-ui/data-grid';
import { makeStyles } from '@material-ui/styles';
import React, { memo, useMemo } from 'react';
import { resolveGridModelFormName } from '../../resolveGridModelFormName';
import { EditRowProps } from './EditRow.types';

const useStyles = makeStyles(() => ({
  box: {
    '& .MuiFormControl-root, & .MuiInputBase-root': {
      width: '100%',
      height: '100%',
    },
  },
}));

const BaseEditRow = ({ api, id, field, name, children }: EditRowProps) => {
  const classes = useStyles();

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
    <ClickAwayListener
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
    </ClickAwayListener>
  );
};

export const EditRow = memo(BaseEditRow, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.field === nextProps.field &&
    prevProps.value === nextProps.value
  );
});
