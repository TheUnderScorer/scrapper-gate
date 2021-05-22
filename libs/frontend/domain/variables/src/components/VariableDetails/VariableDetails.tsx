import {
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Stack,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Variable } from '@scrapper-gate/shared/schema';
import React from 'react';
import { VariableIcon } from '../VariableIcon/VariableIcon';

export interface VariableDetailsProps {
  variable: Variable;
  className?: string;
  hideTitle?: boolean;
}

const useStyles = makeStyles((theme) => ({
  header: {
    background: theme.palette.greyVariant.dark,
  },
}));

export const VariableDetails = ({
  variable,
  className,
  hideTitle,
}: VariableDetailsProps) => {
  const classes = useStyles();

  return (
    <List
      disablePadding
      dense
      className={className}
      subheader={
        hideTitle ? undefined : (
          <ListSubheader className={classes.header} disableGutters>
            <Stack spacing={1} direction="row" alignItems="center">
              <VariableIcon scope={variable.scope} />
              <span>{variable.key}</span>
            </Stack>
          </ListSubheader>
        )
      }
    >
      <ListItem disableGutters>
        <ListItemText
          primary="Default value"
          secondary={variable.defaultValue}
        />
      </ListItem>
      <ListItem disableGutters>
        <ListItemText primary="Current value" secondary={variable.value} />
      </ListItem>
    </List>
  );
};
