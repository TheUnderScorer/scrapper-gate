import { Box, Stack, Tooltip, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DeleteSharp, ErrorSharp } from '@material-ui/icons';
import {
  MenuItemProperties,
  stopPropagation,
} from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import get from 'lodash.get';
import React, { forwardRef, memo, useMemo } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { TooltipText } from '../../../atoms/TooltipText/TooltipText';
import { Dropdown } from '../../../molecules/Dropdown/Dropdown';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { useNodeError } from '../hooks/useNodeError';
import { useRemoveItems } from '../hooks/useRemoveItems';
import { defaultNodeSize } from '../nodeTypes/constants';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { FlowBuilderNodeBoxIcon } from './BoxIcon/FlowBuilderNodeBoxIcon';

export type FlowBuilderNodeProps = NodeProps<BaseNodeProperties>;

const useStyles = makeStyles((theme) => ({
  dropdownIcon: {
    position: 'absolute',
    top: '-35%',
    right: '-15%',
  },
  errorIcon: {
    position: 'absolute',
    top: '-35%',
    left: '-15%',
  },
  text: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    padding: theme.spacing(0.3),
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  deleteStep: {
    '&, & svg': {
      color: theme.palette.error.main,
    },
  },
}));

const BaseFlowBuilderNode = forwardRef<HTMLDivElement, FlowBuilderNodeProps>(
  (node, ref) => {
    const error = useNodeError(node.id);
    const classes = useStyles();
    const removeItems = useRemoveItems();

    const readOnly = useFlowBuilderContextSelector((ctx) => ctx.readOnly);

    const nodeKeyProperty = useFlowBuilderContextSelector(
      (ctx) => ctx.nodeKeyProperty
    );
    const nodeKey = useMemo(() => {
      if (!nodeKeyProperty) {
        return null;
      }

      return get(node, nodeKeyProperty);
    }, [node, nodeKeyProperty]);

    const {
      data: { dropdownMenu, title, nodeAddonBefore },
    } = node;

    const menuItems = useMemo<MenuItemProperties[]>(() => {
      const menuItems = dropdownMenu?.(node) ?? [];

      if (node.data.cannotBeDeleted || readOnly) {
        return menuItems;
      }

      return [
        ...menuItems,
        {
          className: classes.deleteStep,
          id: `delete-step-${node.id}`,
          icon: <DeleteSharp />,
          content: 'Delete step',
          onClick: () => removeItems([node]),
        },
      ];
    }, [classes.deleteStep, dropdownMenu, node, readOnly, removeItems]);

    return (
      <div
        id={`node-${node.id}`}
        onContextMenu={stopPropagation}
        ref={ref}
        className={classNames(
          'flow-builder-node',
          `flow-builder-node-${node.type}`
        )}
      >
        <Box position="relative" textAlign="center" width={defaultNodeSize}>
          {nodeAddonBefore?.(node)}
          {error && (
            <Tooltip title={<TooltipText>{error.message}</TooltipText>}>
              <ErrorSharp color="error" className={classes.errorIcon} />
            </Tooltip>
          )}
          {menuItems.length > 0 && (
            <Dropdown
              iconButtonProps={{
                className: classNames(
                  classes.dropdownIcon,
                  'node-dropdown-trigger'
                ),
                size: 'small',
              }}
              items={menuItems}
            />
          )}

          <FlowBuilderNodeBoxIcon node={node} />
          <Stack direction="column" className={classes.text}>
            <Typography color={error ? 'error' : undefined} variant="caption">
              {title}
            </Typography>

            {nodeKey && (
              <Typography
                noWrap
                color={error ? 'error' : undefined}
                variant="caption"
              >
                #{nodeKey}
              </Typography>
            )}
          </Stack>
        </Box>
      </div>
    );
  }
);

export const FlowBuilderNode = memo(BaseFlowBuilderNode);
