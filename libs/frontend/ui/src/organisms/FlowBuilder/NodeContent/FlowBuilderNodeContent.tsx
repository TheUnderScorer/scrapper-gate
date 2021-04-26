import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import React, { useCallback, useEffect, useMemo } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { Node } from 'react-flow-renderer';
import { useDebounce, usePrevious } from 'react-use';
import {
  FlowBuilderItemsContext,
  useFlowBuilderItemsSelector,
} from '../providers/FlowBuilderItems.provider';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { getById } from '@scrapper-gate/shared/common';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';
import { useFlowBuilderActiveNode } from '../providers/FlowBuilderActiveNode.provider';

interface DialogStyleProps {
  isUsingElementPicker: boolean;
}

const useStyles = makeStyles((theme) => ({
  content: {
    minWidth: '400px',
  },
  dialog: (props: DialogStyleProps) => {
    const defaults = {
      transition: theme.transitions.create('opacity'),
    };

    if (!props.isUsingElementPicker) {
      return defaults;
    }

    return {
      ...defaults,
      opacity: 0,
      visibility: 'hidden',
    };
  },
}));

export const FlowBuilderNodeContent = () => {
  const isUsingElementPicker = useFlowBuilderContextSelector(
    (ctx) => ctx.isUsingElementPicker
  );

  const classes = useStyles({ isUsingElementPicker });

  const {
    activeNodeId,
    contentOpen,
    setContentOpen,
    setActiveNodeId,
  } = useFlowBuilderActiveNode();

  const activeNodeSelector = useCallback(
    (ctx: FlowBuilderItemsContext<BaseNodeProperties>) =>
      activeNodeId
        ? (getById(ctx.getItems(), activeNodeId) as Node<BaseNodeProperties>)
        : null,
    [activeNodeId]
  );

  const activeNode = useFlowBuilderItemsSelector(activeNodeSelector);
  const nodeContents = useFlowBuilderContextSelector((ctx) => ctx.nodeContents);
  const defaultNodeContent = useFlowBuilderContextSelector(
    (ctx) => ctx.defaultNodeContent
  );
  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const getFieldName = useMemo(() => {
    const index = getItems().findIndex((node) => node?.id === activeNode?.id);

    return (name: string) => `items.${index}.data.${name}`;
  }, [activeNode, getItems]);

  const ContentComponent = useMemo(() => {
    if (activeNode?.data?.noContent) {
      return undefined;
    }

    return activeNode
      ? nodeContents?.[activeNode?.type] ?? defaultNodeContent
      : undefined;
  }, [activeNode, defaultNodeContent, nodeContents]);
  const PrevContentComponent = usePrevious(ContentComponent);

  const handleClose = useCallback(() => {
    setContentOpen(false);
  }, [setContentOpen]);

  useEffect(() => {
    if (activeNodeId && ContentComponent) {
      setContentOpen(true);
    }
  }, [ContentComponent, setContentOpen, activeNodeId]);

  useDebounce(
    () => {
      if (!contentOpen) {
        setActiveNodeId(undefined);
      }
    },
    500,
    [contentOpen]
  );

  return (
    <Dialog
      fullWidth
      className={classes.dialog}
      onClose={handleClose}
      open={contentOpen}
    >
      <DialogTitle>Edit step</DialogTitle>
      <DialogContent className={classNames(classes.content, 'node-content')}>
        {ContentComponent && (
          <ContentComponent node={activeNode} getFieldName={getFieldName} />
        )}
        {PrevContentComponent && !ContentComponent && (
          <PrevContentComponent node={activeNode} getFieldName={getFieldName} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
