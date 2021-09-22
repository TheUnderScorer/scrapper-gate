import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Selection } from '@scrapper-gate/frontend/common';
import classNames from 'classnames';
import React, { useMemo } from 'react';

import { useDrag } from 'react-dnd';
import {
  BaseNodeSelectionProperties,
  FlowBuilderDropTypes,
} from '../../FlowBuilder.types';
import { useNodeMetadata } from '../../hooks/useNodeMetadata';

const PREFIX = 'FlowBuilderSidebarItem';

const classes = {
  tile: `${PREFIX}-tile`,
  text: `${PREFIX}-text`,
};

const StyledListItem = styled(ListItem)(({ theme }) => ({
  [`&.${classes.tile}`]: {
    transform: 'translate3d(0,0,0)',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&.isDragging': {
      opacity: 0.5,
    },
  },

  [`& .${classes.text}`]: {
    marginLeft: theme.spacing(1),
  },
}));

export interface FlowBuilderSidebarItemProps<
  S extends BaseNodeSelectionProperties
> {
  item: Selection<S>;
  className?: string;
}

export const FlowBuilderSidebarItem = <S extends BaseNodeSelectionProperties>({
  item,
  className,
}: FlowBuilderSidebarItemProps<S>) => {
  const metaData = useNodeMetadata(item.value.type);

  const boxWithIcon = useMemo(() => {
    const Component = metaData.boxWithIcon;

    return <Component width={50} height={50} icon={item.icon} />;
  }, [metaData, item.icon]);

  const [{ isDragging }, drag] = useDrag<
    Selection<S>,
    Selection<S>,
    { isDragging: boolean }
  >({
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    type: FlowBuilderDropTypes.Node,
  });

  return (
    <StyledListItem
      ref={drag}
      className={classNames(classes.tile, className, { isDragging })}
    >
      <ListItemIcon>{boxWithIcon}</ListItemIcon>
      <ListItemText className={classes.text}>{item.label}</ListItemText>
    </StyledListItem>
  );
};
