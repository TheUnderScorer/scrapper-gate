import { Box, ClickAwayListener } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GridApi } from '@material-ui/data-grid';
import React, { useRef } from 'react';
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

export const EditRow = ({ api, id, field, name, children }: EditRowProps) => {
  const classes = useStyles();

  const fullName = resolveGridModelFormName({
    id,
    name,
    field,
    api,
  });

  const containerRef = useRef<HTMLDivElement>();

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
        ref={containerRef}
        tabIndex={0}
        width="100%"
      >
        {children({ name: fullName })}
      </Box>
    </ClickAwayListener>
  );
};
