import {
  Box,
  Button,
  Divider,
  Slide,
  Stack,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getById } from '@scrapper-gate/shared/common';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Node } from 'react-flow-renderer';
import { useDebounce, usePrevious } from 'react-use';
import { Layout } from '../../../molecules/Layout/Layout';
import { ResizablePanel } from '../../../molecules/ResizablePanel/ResizablePanel';
import { BaseNodeProperties } from '../FlowBuilder.types';
import { useFlowBuilderActiveNode } from '../providers/FlowBuilderActiveNode.provider';
import {
  FlowBuilderItemsContext,
  useFlowBuilderItemsSelector,
} from '../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../providers/FlowBuilderProps.provider';

interface StyleProps {
  isUsingElementPicker?: boolean;
  open: boolean;
}

const useStyles = makeStyles((theme) => ({
  content: {
    padding: `0 ${theme.spacing(2)}`,
  },
  btnDivider: {
    marginBottom: theme.spacing(1),
  },
  drawer: {
    position: 'absolute !important' as 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    zIndex: 4,
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  paper: (props: StyleProps) => {
    const defaults = {
      transition: theme.transitions.create('opacity'),
      borderRadius: 0,
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
  slide: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100%',
    zIndex: theme.zIndex.drawer,
  },
}));

export const FlowBuilderNodeContent = () => {
  const isUsingElementPicker = useFlowBuilderContextSelector(
    (ctx) => ctx.isUsingElementPicker
  );

  const { activeNodeId, contentOpen, setContentOpen, setActiveNodeId } =
    useFlowBuilderActiveNode();

  const classes = useStyles({ isUsingElementPicker, open: contentOpen });

  const getItems = useFlowBuilderItemsSelector((ctx) => ctx.getItems);

  const activeNodeSelector = useCallback(
    (ctx: FlowBuilderItemsContext<BaseNodeProperties>) =>
      activeNodeId
        ? (getById(ctx.getItems(), activeNodeId) as Node<BaseNodeProperties>)
        : null,
    [activeNodeId]
  );

  const activeNode = useFlowBuilderItemsSelector(activeNodeSelector);
  const activeNodeIndex = useMemo(() => {
    return (
      activeNode && getItems().findIndex((item) => item?.id === activeNode.id)
    );
  }, [activeNode, getItems]);

  const nodeContents = useFlowBuilderContextSelector((ctx) => ctx.nodeContents);
  const defaultNodeContent = useFlowBuilderContextSelector(
    (ctx) => ctx.defaultNodeContent
  );

  const getFieldName = useMemo(() => {
    return (name?: string) => `items[${activeNodeIndex}].data.${name}`;
  }, [activeNodeIndex]);

  const ContentComponent = useMemo(() => {
    console.log({ activeNode });
    if (activeNode?.data?.noContent) {
      return undefined;
    }

    return activeNode?.type
      ? nodeContents?.[activeNode.type] ?? defaultNodeContent
      : undefined;
  }, [activeNode, defaultNodeContent, nodeContents]);
  const PrevContentComponent = usePrevious(ContentComponent);

  const handleClose = useCallback(() => {
    setContentOpen(false);
  }, [setContentOpen]);

  useEffect(() => {
    setContentOpen(Boolean(activeNodeId && ContentComponent));
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
    <Slide direction="left" in={contentOpen}>
      <ResizablePanel
        disableKeyShortcut
        hideArrow
        paperProps={{
          className: classes.paper,
        }}
        initialWidth="20%"
        minWidth="500px"
        maxWidth="900px"
        className={classNames(
          classes.drawer,
          `node-content-${contentOpen ? 'open' : 'closed'}`
        )}
        enable={{
          left: true,
        }}
      >
        <Layout
          body={
            <Stack
              spacing={3}
              className={classNames(classes.content, 'node-content')}
            >
              <Typography variant="h6">Edit step</Typography>
              {ContentComponent && (
                <ContentComponent
                  nodeIndex={activeNodeIndex ?? -1}
                  getFieldName={getFieldName}
                />
              )}
              {PrevContentComponent && !ContentComponent && (
                <PrevContentComponent
                  nodeIndex={activeNodeIndex ?? -1}
                  getFieldName={getFieldName}
                />
              )}
            </Stack>
          }
          footerHeight={50}
          footer={
            <>
              <Divider className={classes.btnDivider} variant="fullWidth" />
              <Box paddingLeft={2}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  color="primary"
                  autoFocus
                >
                  Close
                </Button>
              </Box>
            </>
          }
        />
      </ResizablePanel>
    </Slide>
  );
};
