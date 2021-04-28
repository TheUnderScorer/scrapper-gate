import {
  CircularProgress,
  makeStyles,
  Stack,
  Typography,
} from '@material-ui/core';
import React, {
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import ReactFlow from 'react-flow-renderer';
import classNames from 'classnames';
import { useFlowBuilderInstanceContext } from '../providers/FlowBuilderInstance.provider';
import { useFlowBuilderDragState } from '../providers/FlowBuilderDragState.provider';
import {
  BaseNodeSelectionProperties,
  FlowBuilderDropTypes,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import { FlowBuilderConnectionLine } from '../ConnectionLine/FlowBuilderConnectionLine';
import { useConnectHandler } from '../hooks/useConnectHandler';
import { useAddItem } from '../hooks/useAddItem';
import { FlowBuilderNode } from '../Node/FlowBuilderNode';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { edgeTypes } from '../edgeTypes/edgeTypes';
import { useRemoveItems } from '../hooks/useRemoveItems';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useHandleDragEnd } from '../hooks/useHandleDragEnd';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import { Selection } from '@scrapper-gate/frontend/common';
import { Centered, ContextMenu } from '@scrapper-gate/frontend/ui';
import { useCanvasContextMenu } from '../hooks/useCanvasContextMenu';

const useStyles = makeStyles((theme: AppTheme) => ({
  paper: {
    backgroundColor: theme.palette.greyVariant['100'],
    flex: 1,
    position: 'relative',
  },
  canvas: {
    '& .react-flow__handle': {
      width: '15px',
      height: '20px',
      padding: theme.spacing(0.3),
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      '&::after': {
        width: '15px',
        height: '15px',
        content: '""',
        borderRadius: '50%',
        position: 'absolute',
        right: '-2px',
        boxShadow: theme.shadows[1],
        border: `1px solid ${theme.palette.background.paper}`,
      },
    },
    '& .react-flow__handle-top, & .react-flow__handle-bottom': {
      width: '15px',
    },
    '& .react-flow__handle-top::after': {
      top: '-2px',
      left: '3px',
    },
    '& .react-flow__handle-bottom::after': {
      bottom: '-2px',
      left: '3px',
    },
    '& .react-flow__handle-left::after': {
      right: 'auto',
      left: '-2px',
    },
    '& .react-flow__handle.target::after': {
      background: theme.palette.secondary.light,
    },
    '& .react-flow__handle.source::after': {
      background: theme.palette.primary.dark,
    },
    '& #react-flow__arrow polyline, & #react-flow__arrowclosed polyline': {
      stroke: theme.palette.secondary.light,
      fill: theme.palette.secondary.light,
    },
    '& .react-flow__handle-connecting': {
      '&:not(.react-flow__handle-valid)::after': {
        opacity: 0.9,
        background: theme.palette.error.main,
        cursor: 'not-allowed',
      },
    },
  },
}));

export const FlowBuilderCanvas = () => {
  const containerRef = useRef<HTMLDivElement>();

  const classes = useStyles();

  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);

  const mappedNodeTypes = useMemo(
    () =>
      Object.keys(nodeTypes).reduce<Record<string, ReactNode>>((acc, key) => {
        acc[key] = FlowBuilderNode;

        return acc;
      }, {}),
    [nodeTypes]
  );

  const addItem = useAddItem();
  const connect = useConnectHandler();

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);

  const removeItems = useRemoveItems();
  const handleDragEnd = useHandleDragEnd();

  const { setDraggedNode } = useFlowBuilderDragState();

  const { setFlowInstance, flowInstance } = useFlowBuilderInstanceContext();

  const items = useFlowBuilderItemsSelector((ctx) => ctx.items);
  const setConnectionSource = useFlowBuilderItemsSelector(
    (ctx) => ctx.setConnectionSource
  );

  const handleDrop = useCallback(
    async (
      item: Selection<BaseNodeSelectionProperties>,
      monitor: DropTargetMonitor
    ) => {
      const { x, y } = monitor.getClientOffset();

      const flowBounds = containerRef.current.getBoundingClientRect();

      const position = flowInstance.project({
        x: x - flowBounds.left,
        y: y - flowBounds.top,
      });

      await addItem(item, { position });
    },
    [addItem, flowInstance]
  );

  const handleConnectionEnd = useCallback(() => {
    setConnectionSource(undefined);
  }, [setConnectionSource]);

  const [{ canDrop }, drop] = useDrop({
    accept: FlowBuilderDropTypes.Node,
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
    drop: handleDrop,
  });

  const {
    menuItems,
    handleOpen: handleContextMenuOpen,
    handleClose: handleContextMenuClose,
    menuRef,
  } = useCanvasContextMenu({
    containerRef,
  });

  useEffect(() => {
    drop(containerRef.current);
  }, [drop]);

  if (loading) {
    return (
      <Centered className={classes.paper}>
        <Stack alignItems="center" direction="column" spacing={2}>
          <CircularProgress />
          <Typography variant="body2">Loading builder...</Typography>
        </Stack>
      </Centered>
    );
  }

  return (
    <ContextMenu
      ref={menuRef}
      onOpen={handleContextMenuOpen}
      onClose={handleContextMenuClose}
      menuItems={menuItems}
    >
      {({ onContextMenu }) => (
        <div
          onContextMenu={onContextMenu}
          ref={containerRef as MutableRefObject<HTMLDivElement>}
          className={classNames(classes.paper, 'flow-builder-canvas', {
            canDrop,
          })}
        >
          <ReactFlow
            edgeTypes={edgeTypes}
            className={classes.canvas}
            onLoad={(instance) => {
              instance.fitView();

              setFlowInstance(instance);
            }}
            elements={items}
            nodeTypes={mappedNodeTypes}
            onElementsRemove={
              removeItems as (items: FlowBuilderItem<unknown>[]) => unknown
            }
            onConnect={connect}
            onNodeDragStop={handleDragEnd}
            onNodeDrag={(event, node) => {
              setTimeout(() => setDraggedNode(node), 150);
            }}
            onConnectStart={(event, data) => {
              console.log('connect start', { data });
              setConnectionSource(data);
            }}
            onConnectEnd={handleConnectionEnd}
            connectionLineComponent={FlowBuilderConnectionLine}
          />
        </div>
      )}
    </ContextMenu>
  );
};
