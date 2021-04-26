import React, { forwardRef, memo, useMemo } from 'react';
import { NodeProps } from 'react-flow-renderer';
import { Box, Tooltip, Typography } from '@material-ui/core';
import { Dropdown, TooltipText } from '@scrapper-gate/frontend/ui';
import { DeleteSharp, ErrorSharp } from '@material-ui/icons';
import { defaultNodeSize } from '../nodeTypes/constants';
import { useNodeError } from '../hooks/useNodeError';
import { FlowBuilderNodeBoxIcon } from './BoxIcon/FlowBuilderNodeBoxIcon';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  MenuItemProperties,
  stopPropagation,
} from '@scrapper-gate/frontend/common';
import { useRemoveItems } from '../hooks/useRemoveItems';

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
    display: 'block',
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

    const {
      data: { dropdownMenu, title },
    } = node;

    const menuItems = useMemo<MenuItemProperties[]>(() => {
      if (node.data.cannotBeDeleted) {
        return dropdownMenu?.(node);
      }

      return [
        ...(dropdownMenu?.(node) ?? []),
        {
          className: classes.deleteStep,
          id: 'delete_step',
          icon: <DeleteSharp />,
          content: 'Delete step',
          onClick: () => removeItems([node]),
        },
      ];
    }, [classes.deleteStep, dropdownMenu, node, removeItems]);

    return (
      <div
        onContextMenu={stopPropagation}
        ref={ref}
        className={classNames(
          'flow-builder-node',
          `flow-builder-node-${node.type}`
        )}
      >
        <Box position="relative" textAlign="center" width={defaultNodeSize}>
          {error && (
            <Tooltip title={<TooltipText>{error}</TooltipText>}>
              <ErrorSharp color="error" className={classes.errorIcon} />
            </Tooltip>
          )}
          {(dropdownMenu || !node.data?.cannotBeDeleted) && (
            <Dropdown
              iconButtonProps={{
                className: classes.dropdownIcon,
                size: 'small',
              }}
              items={menuItems}
            />
          )}

          <FlowBuilderNodeBoxIcon node={node} />
          <Typography
            color={error ? 'error' : undefined}
            variant="caption"
            className={classes.text}
          >
            {title}
          </Typography>
        </Box>
      </div>
    );
  }
);

export const FlowBuilderNode = memo(BaseFlowBuilderNode);
