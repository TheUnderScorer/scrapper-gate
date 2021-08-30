import {
  AppBar,
  Divider,
  Fab,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import { CloseSharp, SortSharp } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import { MenuItemProperties } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, { ReactNode, useCallback } from 'react';
import { useFormState } from 'react-final-form';
import { TooltipText } from '../../../atoms/TooltipText/TooltipText';
import { Dropdown } from '../../../molecules/Dropdown/Dropdown';
import { FormStateIcon } from '../../../molecules/FormStateIcon/FormStateIcon';
import { SkeletonComponentOrIcon } from '../../../molecules/Skeleton/ComponentOrIcon/SkeletonComponentOrIcon';
import { UndoButtons } from '../../../molecules/UndoButtons/UndoButtons';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { mainTab } from '../Tabs/FlowBuilderTabs';
import { buildBasicGraph } from '../utils/graph';

export interface FlowBuilderHeaderProps {
  title?: ReactNode;
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
    width: '100px !important',
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
      validating: true,
    },
  });

  const hasErrors = formState.hasValidationErrors;

  const setItems = useFlowBuilderItemsSelector((ctx) => ctx.setItems);
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const activeTab = useFlowBuilderContextSelector((ctx) => ctx.activeTab);

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);

  const readOnly = useFlowBuilderContextSelector((ctx) => ctx.readOnly);

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
                {title}
              </>
            )}
            {loading && (
              <>
                <Skeleton variant="circular" width={30} height={30} />
                <Skeleton variant="text" width={60} height={10} />
              </>
            )}
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {!readOnly && (
              <>
                {activeTab === mainTab && (
                  <SkeletonComponentOrIcon
                    loading={loading}
                    width={30}
                    height={30}
                  >
                    <Tooltip title={<TooltipText>Sort items</TooltipText>}>
                      <IconButton onClick={handleSort}>
                        <SortSharp />
                      </IconButton>
                    </Tooltip>
                  </SkeletonComponentOrIcon>
                )}
                <SkeletonComponentOrIcon
                  loading={loading}
                  width={30}
                  height={30}
                >
                  <UndoButtons />
                </SkeletonComponentOrIcon>
              </>
            )}
            {additionalActions}
            {!readOnly && (
              <>
                <Divider orientation="vertical" className={classes.divider} />
                <SkeletonComponentOrIcon
                  loading={loading}
                  width={30}
                  height={30}
                >
                  <FormStateIcon className={classes.iconButton} />
                </SkeletonComponentOrIcon>
                <SkeletonComponentOrIcon
                  variant="rectangular"
                  loading={loading}
                  width={60}
                  height={30}
                >
                  <Fab
                    disabled={formState.submitting || hasErrors}
                    className={classNames(
                      classes.fab,
                      'flow-builder-submit-btn'
                    )}
                    size="small"
                    variant="extended"
                    color="primary"
                    type="submit"
                  >
                    {formState.validating
                      ? 'Checking...'
                      : formState.submitting
                      ? 'Saving...'
                      : 'Save'}
                  </Fab>
                </SkeletonComponentOrIcon>
              </>
            )}
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
