import React, { useMemo } from 'react';

import { useDrag } from 'react-dnd';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {
  BaseNodeSelectionProperties,
  FlowBuilderDropTypes,
} from '../../../FlowBuilder.types';
import { useNodeMetadata } from '../../../hooks/useNodeMetadata';
import { Selection } from '@scrapper-gate/frontend/common';

export interface FlowBuilderSidebarItemProps<
  S extends BaseNodeSelectionProperties
> {
  item: Selection<S>;
  className?: string;
}

const useStyles = makeStyles((theme) => ({
  tile: {
    transform: 'translate3d(0,0,0)',
    cursor: 'pointer',
    marginBottom: theme.spacing(2),
    '&.isDragging': {
      opacity: 0.5,
    },
  },
  text: {
    marginLeft: theme.spacing(1),
  },
}));

export const FlowBuilderSidebarItem = <S extends BaseNodeSelectionProperties>({
  item,
  className,
}: FlowBuilderSidebarItemProps<S>) => {
  const classes = useStyles();

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
    options: {
      dropEffect: 'copy',
    },
    type: FlowBuilderDropTypes.Node,
  });

  return (
    <ListItem
      ref={drag}
      className={classNames(classes.tile, className, { isDragging })}
    >
      <ListItemIcon>{boxWithIcon}</ListItemIcon>
      <ListItemText className={classes.text}>{item.label}</ListItemText>
    </ListItem>
  );
};
