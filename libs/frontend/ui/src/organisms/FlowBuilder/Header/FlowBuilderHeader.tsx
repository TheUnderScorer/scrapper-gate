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
import { Dropdown, TooltipText, UndoButtons } from '@scrapper-gate/frontend/ui';
import { buildBasicGraph } from '../utils/graph';
import { useFormState } from 'react-final-form';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { SkeletonComponentOrIcon } from '../../../molecules/Skeleton/ComponentOrIcon/SkeletonComponentOrIcon';
import { Skeleton } from '@material-ui/lab';
import classNames from 'classnames';

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
      errors: true,
      hasValidationErrors: true,
    },
  });

  const hasErrors = formState.hasValidationErrors;

  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);

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
            {!loading && (
              <>
                {onClose && (
                  <IconButton className={classes.iconButton} onClick={onClose}>
                    <CloseSharp />
                  </IconButton>
                )}
                {title && <Typography variant="h5">{title}</Typography>}
              </>
            )}
            {loading && (
              <>
                <Skeleton variant="circle" width={30} height={30} />
                <Skeleton variant="text" width={60} height={10} />
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            <SkeletonComponentOrIcon loading={loading} width={30} height={30}>
              <Tooltip title={<TooltipText>Sort items</TooltipText>}>
                <IconButton onClick={handleSort}>
                  <SortSharp />
                </IconButton>
              </Tooltip>
            </SkeletonComponentOrIcon>
            <SkeletonComponentOrIcon loading={loading} width={30} height={30}>
              <UndoButtons />
            </SkeletonComponentOrIcon>
            {additionalActions}
            <Divider orientation="vertical" className={classes.divider} />
            <SkeletonComponentOrIcon loading={loading} width={30} height={30}>
              <FormStateIcon className={classes.iconButton} />
            </SkeletonComponentOrIcon>
            <SkeletonComponentOrIcon
              variant="rect"
              loading={loading}
              width={60}
              height={30}
            >
              <Fab
                disabled={formState.submitting || hasErrors}
                className={classNames(classes.fab, 'flow-builder-submit-btn')}
                size="small"
                variant="extended"
                color="primary"
                type="submit"
              >
                {formState.submitting ? 'Saving...' : 'Save'}
              </Fab>
            </SkeletonComponentOrIcon>
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
