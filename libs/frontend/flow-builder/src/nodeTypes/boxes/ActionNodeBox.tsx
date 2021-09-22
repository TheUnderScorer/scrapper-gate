import { Box, Paper } from '@mui/material';
import { Centered } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React from 'react';
import { NodeIconBoxProps } from '../../FlowBuilder.types';

export type ActionNodeBoxProps = NodeIconBoxProps;

export const ActionNodeBox = ({
  icon,
  className,
  width,
  height,
  onDoubleClick,
  iconClassName,
  handles,
}: ActionNodeBoxProps) => {
  return (
    <Paper
      sx={{
        '&.MuiPaper-root': {
          backgroundColor: (theme) => theme.palette.flowBuilderColors.action,
          color: (theme) => theme.palette.flowBuilderColors.actionText,
        },
      }}
      className={classNames(className, 'action-node-box')}
      onDoubleClick={onDoubleClick}
      variant="outlined"
      style={{
        width,
        height,
        position: 'relative',
      }}
    >
      <Centered>
        <Box component="span" display="inline-flex" className={iconClassName}>
          {icon}
        </Box>
      </Centered>
      {handles}
    </Paper>
  );
};
