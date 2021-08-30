import { CircularProgress, Stack, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Selection } from '@scrapper-gate/frontend/common';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { stringifyCircular } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import React, {
  MouseEvent,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { DropTargetMonitor, useDrop } from 'react-dnd';
import ReactFlow, {
  Connection,
  Edge,
  Node,
  OnConnectStartParams,
  OnLoadParams,
} from 'react-flow-renderer';
import { Key } from 'ts-key-enum';
import { Centered } from '../../../atoms/Centered/Centered';
import { ContextMenu } from '../../../molecules/ContextMenu/ContextMenu';
import { FlowBuilderConnectionLine } from '../ConnectionLine/FlowBuilderConnectionLine';
import { edgeTypes } from '../edgeTypes/edgeTypes';
import {
  BaseNodeProperties,
  BaseNodeSelectionProperties,
  FlowBuilderDropTypes,
  FlowBuilderItem,
} from '../FlowBuilder.types';
import { useAddItem } from '../hooks/useAddItem';
import { useCanvasContextMenu } from '../hooks/useCanvasContextMenu';
import { useConnectHandler } from '../hooks/useConnectHandler';
import { useHandleDragEnd } from '../hooks/useHandleDragEnd';
import { useRemoveItems } from '../hooks/useRemoveItems';
import { FlowBuilderNode } from '../Node/FlowBuilderNode';
import { useFlowBuilderDragState } from '../providers/FlowBuilderDragState.provider';
import { useFlowBuilderInstanceContext } from '../providers/FlowBuilderInstance.provider';
import { useFlowBuilderItemsSelector } from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

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

const snapGrid: [number, number] = [15, 15];
const defaultPosition: [number, number] = [0, 0];

export const FlowBuilderCanvas = () => {
  const containerRef = useRef<HTMLDivElement>();

  const classes = useStyles();

  const nodeTypes = useFlowBuilderContextSelector((ctx) => ctx.nodeTypes);

  const mappedNodeTypes = useMemo(() => {
    if (!nodeTypes) {
      return {};
    }

    return Object.keys(nodeTypes).reduce<Record<string, ReactNode>>(
      (acc, key) => {
        acc[key] = FlowBuilderNode;

        return acc;
      },
      {}
    );
  }, [nodeTypes]);

  const addItem = useAddItem();
  const connect = useConnectHandler();

  const loading = useFlowBuilderContextSelector((ctx) => ctx.loading);
  const renderItemsInDataAttribute = useFlowBuilderContextSelector(
    (ctx) => ctx.renderItemsInDataAttribute
  );

  const removeItems = useRemoveItems();
  const handleDragEnd = useHandleDragEnd();

  const { setDraggedNode } = useFlowBuilderDragState();

  const { setFlowInstance, flowInstance } = useFlowBuilderInstanceContext();

  const readOnly = useFlowBuilderContextSelector((ctx) => ctx.readOnly);

  const items = useFlowBuilderItemsSelector((ctx) => ctx.items);
  const setConnectionSource = useFlowBuilderItemsSelector(
    (ctx) => ctx.setConnectionSource
  );

  const handleDrop = useCallback(
    async (
      item: Selection<BaseNodeSelectionProperties>,
      monitor: DropTargetMonitor
    ) => {
      const offset = monitor.getClientOffset();

      if (!offset || !containerRef.current || !flowInstance) {
        return;
      }

      const { x, y } = offset;

      const flowBounds = containerRef.current.getBoundingClientRect();

      const position = flowInstance.project({
        x: x - flowBounds.left,
        y: y - flowBounds.top,
      });

      await addItem(item, { position });
    },
    [addItem, flowInstance]
  );

  const handleDrag = useCallback(
    (event: MouseEvent, node: Node) => {
      setTimeout(() => setDraggedNode(node), 150);
    },
    [setDraggedNode]
  );

  const handleConnectStart = useCallback(
    (event: MouseEvent, data: OnConnectStartParams) => {
      setConnectionSource(data);
    },
    [setConnectionSource]
  );

  const handleConnectionEnd = useCallback(() => {
    setConnectionSource(null);
  }, [setConnectionSource]);

  const handleLoad = useCallback(
    (instance: OnLoadParams) => {
      instance.fitView();

      setFlowInstance?.(instance);
    },
    [setFlowInstance]
  );

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
    if (containerRef.current) {
      drop(containerRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drop, containerRef.current]);

  if (loading || !items?.length) {
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
      ref={menuRef as MutableRefObject<HTMLDivElement>}
      onOpen={handleContextMenuOpen}
      onClose={handleContextMenuClose}
      menuItems={menuItems}
    >
      {({ onContextMenu }) => (
        <div
          data-items={
            renderItemsInDataAttribute ? stringifyCircular(items) : undefined
          }
          onContextMenu={onContextMenu}
          ref={containerRef as MutableRefObject<HTMLDivElement>}
          className={classNames(classes.paper, 'flow-builder-canvas', {
            canDrop,
          })}
        >
          <ReactFlow
            nodesDraggable={!readOnly}
            nodesConnectable={!readOnly}
            defaultPosition={defaultPosition}
            snapGrid={snapGrid}
            edgeTypes={edgeTypes}
            className={classes.canvas}
            onLoad={handleLoad}
            elements={items}
            nodeTypes={mappedNodeTypes}
            onElementsRemove={
              removeItems as (
                items: FlowBuilderItem<BaseNodeProperties>[]
              ) => unknown
            }
            onConnect={connect as (connect: Connection | Edge) => unknown}
            onNodeDragStop={handleDragEnd}
            onNodeDrag={handleDrag}
            onConnectStart={handleConnectStart}
            onConnectEnd={handleConnectionEnd}
            connectionLineComponent={FlowBuilderConnectionLine}
            /*TODO Find a way to disable this at all*/
            deleteKeyCode={Key.Delete}
          />
        </div>
      )}
    </ContextMenu>
  );
};
