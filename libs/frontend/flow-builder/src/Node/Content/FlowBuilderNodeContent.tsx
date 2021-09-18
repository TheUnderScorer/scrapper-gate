import { Box, Button, Divider, Slide, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Layout, ResizablePanel } from '@scrapper-gate/frontend/ui';
import { getById } from '@scrapper-gate/shared/common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Node } from 'react-flow-renderer';
import { useDebounce, usePrevious } from 'react-use';
import { BaseNodeProperties } from '../../FlowBuilder.types';
import { useFlowBuilderActiveNode } from '../../providers/FlowBuilderActiveNode.provider';
import {
  FlowBuilderItemsContext,
  useFlowBuilderItemsSelector,
} from '../../providers/FlowBuilderItems.provider';
import { useFlowBuilderContextSelector } from '../../providers/FlowBuilderProps.provider';

const StyledSlide = styled(Slide)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  height: '100%',
  zIndex: theme.zIndex.drawer,
}));

export const FlowBuilderNodeContent = () => {
  const isUsingElementPicker = useFlowBuilderContextSelector(
    (ctx) => ctx.isUsingElementPicker
  );
  const title = useFlowBuilderContextSelector((ctx) => ctx.nodeContentTitle);

  const { activeNodeId, contentOpen, setContentOpen, setActiveNodeId } =
    useFlowBuilderActiveNode();

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
    <StyledSlide direction="left" in={contentOpen}>
      <ResizablePanel
        disableKeyShortcut
        hideArrow
        paperProps={{
          sx: {
            transition: (theme) => theme.transitions.create('opacity'),
            borderRadius: 0,
            opacity: isUsingElementPicker ? 0 : 1,
            visibility: isUsingElementPicker ? 'hidden' : 'visible',
          },
        }}
        initialWidth="20%"
        minWidth="500px"
        maxWidth="900px"
        sx={{
          position: 'absolute !important' as 'absolute',
          top: 0,
          right: 0,
          height: '100%',
          zIndex: 4,
        }}
        className={`node-content-${contentOpen ? 'open' : 'closed'}`}
        enable={{
          left: true,
        }}
      >
        <Layout
          body={
            <Stack
              sx={{
                padding: (theme) => `0 ${theme.spacing(2)}`,
              }}
              spacing={3}
              className="node-content"
            >
              <Typography variant="h6">{title ?? 'Edit step'}</Typography>
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
            <Box>
              <Divider
                sx={{
                  marginBottom: (theme) => theme.spacing(1),
                }}
                variant="fullWidth"
              />
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
            </Box>
          }
        />
      </ResizablePanel>
    </StyledSlide>
  );
};
