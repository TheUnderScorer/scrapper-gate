import React, { ReactNode, useCallback } from 'react';
import {
  AppBar,
  Divider,
  Fab,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { CloseSharp, SortSharp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { FormStateIcon } from '../../../molecules/FormStateIcon/FormStateIcon';
import { Dropdown, UndoButtons, TooltipText } from '@scrapper-gate/frontend/ui';
import { buildBasicGraph } from '../utils/graph';
import { useFormState } from 'react-final-form';

export interface FlowBuilderHeaderProps {
  title?: string;
  onClose?: () => unknown;
  onSave?: () => unknown;
  additionalActions?: ReactNode;
  menu?: MenuItemProperties[];
}

const useStyles = makeStyles(() => ({
  iconButton: {
    padding: 0,
  },
  appBar: {
    height: '40px',
  },
  mainGrid: {
    height: '100%',
    width: '100%',
  },
  divider: {
    height: '30px',
  },
  fab: {
    width: '90px !important',
    boxShadow: 'none',
  },
}));

export const FlowBuilderHeader = ({
  onClose,
  title,
  additionalActions,
  menu,
}: FlowBuilderHeaderProps) => {
  const classes = useStyles();
  const formState = useFormState({
    subscription: {
      submitting: true,
      hasValidationErrors: true,
    },
  });

  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const handleSort = useCallback(() => {
    const { items: newItems } = buildBasicGraph(getItems());

    setItems(newItems);
  }, [getItems, setItems]);

  return (
    <AppBar elevation={0} color="transparent" position="static">
      <Toolbar className={classes.appBar}>
        <Stack
          justifyContent="space-between"
          alignItems="center"
          direction="row"
          className={classes.mainGrid}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            {onClose && (
              <IconButton className={classes.iconButton} onClick={onClose}>
                <CloseSharp />
              </IconButton>
            )}
            {title && <Typography variant="h5">{title}</Typography>}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title={<TooltipText>Sort items</TooltipText>}>
              <IconButton onClick={handleSort}>
                <SortSharp />
              </IconButton>
            </Tooltip>
            <UndoButtons />
            {additionalActions}
            <Divider orientation="vertical" className={classes.divider} />
            <FormStateIcon className={classes.iconButton} />
            <Fab
              disabled={formState.submitting || formState.hasValidationErrors}
              className={classes.fab}
              size="small"
              variant="extended"
              color="primary"
              type="submit"
            >
              {formState.submitting ? 'Saving...' : 'Save'}
            </Fab>
            {menu && (
              <Dropdown
                iconButtonProps={{
                  className: classes.iconButton,
                }}
                items={menu}
              />
            )}
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};