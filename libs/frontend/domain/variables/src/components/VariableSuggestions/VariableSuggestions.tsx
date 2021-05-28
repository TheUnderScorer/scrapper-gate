import {
  createFilterOptions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  useTheme,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { AttachMoney } from '@material-ui/icons';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Emoji, Highlight } from '@scrapper-gate/frontend/ui';
import { first, getLastIndex } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useKey } from 'react-use';
import { Key } from 'ts-key-enum';
import { useVariablesContextSelector } from '../../providers/VariablesProvider';
import { VariableDetails } from '../VariableDetails/VariableDetails';

export interface VariableSuggestionsProps {
  text: string;
  onVariableClick?: (variable: Variable) => unknown;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    minWidth: '35px',
  },
  item: {
    cursor: 'pointer',
  },
  stack: {
    minWidth: '400px',
  },
  stackItem: {
    width: '49%',
  },
  divider: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
}));

export const VariableSuggestions = ({
  text,
  onVariableClick,
}: VariableSuggestionsProps) => {
  const classes = useStyles();
  const variables = useVariablesContextSelector((ctx) => ctx.filteredVariables);

  const theme = useTheme() as AppTheme;

  const rawText = useMemo(() => text.replace(/{/g, '').replace(/}/g, ''), [
    text,
  ]);

  const filteredVariables = useMemo(() => {
    if (!rawText) {
      return variables;
    }

    return createFilterOptions<Variable>({
      matchFrom: 'any',
      stringify: (option) => option.key,
    })(variables, {
      inputValue: rawText,
      getOptionLabel: (option) => option.key,
    });
  }, [rawText, variables]);

  const [selectedVariable, setSelectedVariable] = useState(
    first(filteredVariables)
  );

  // TODO Make this more generic
  const handleNavigation = useCallback(
    (direction: 'top' | 'bottom') => {
      const index = filteredVariables.indexOf(selectedVariable);
      const lastIndex = getLastIndex(filteredVariables);

      let newIndex = direction === 'top' ? index - 1 : index + 1;

      if (newIndex === -1) {
        newIndex = lastIndex;
      } else if (newIndex > lastIndex) {
        newIndex = 0;
      }

      const newVariable = filteredVariables[newIndex];

      setSelectedVariable(newVariable ?? first(filteredVariables));
    },
    [filteredVariables, selectedVariable]
  );

  useKey(
    Key.Enter,
    () => {
      const variable = filteredVariables.find(
        (variable) => variable.id === selectedVariable.id
      );

      if (variable) {
        onVariableClick?.(variable);
      }
    },
    {},
    [filteredVariables, selectedVariable, onVariableClick]
  );

  useKey(
    Key.ArrowUp,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation('top');
    },
    {},
    [handleNavigation]
  );
  useKey(
    Key.ArrowDown,
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      handleNavigation('bottom');
    },
    {},
    [handleNavigation]
  );

  useEffect(() => {
    if (!filteredVariables.includes(selectedVariable)) {
      setSelectedVariable(first(filteredVariables));
    }
  }, [filteredVariables, selectedVariable]);

  return (
    <Stack
      className={classNames(classes.stack, 'variable-suggestions-container')}
      spacing={0}
      direction="row"
    >
      <List
        className={classes.stackItem}
        dense
        subheader={
          filteredVariables.length ? (
            <ListSubheader component="li">Variables</ListSubheader>
          ) : undefined
        }
      >
        {!filteredVariables.length && (
          <ListItem component="li" disableGutters>
            <ListItemText
              primary={
                <>
                  No variables found <Emoji>{theme.emojis.empty}</Emoji>
                </>
              }
            />
          </ListItem>
        )}

        {filteredVariables.map((variable) => (
          <ListItem
            onMouseDown={(event) => {
              event.preventDefault();

              onVariableClick?.(variable);
            }}
            className={classNames(classes.item, 'variable-list-item')}
            role="button"
            selected={selectedVariable?.id === variable.id}
            onMouseOver={() => setSelectedVariable(variable)}
            tabIndex={0}
            component="li"
            key={variable.id}
          >
            <ListItemIcon className={classes.icon}>
              <AttachMoney />
            </ListItemIcon>
            <ListItemText
              primary={<Highlight text={variable.key} value={rawText} />}
            />
          </ListItem>
        ))}
      </List>
      {selectedVariable && (
        <>
          <Divider
            className={classes.divider}
            orientation="vertical"
            flexItem
          />
          <VariableDetails
            className={classes.stackItem}
            variable={selectedVariable}
          />
        </>
      )}
    </Stack>
  );
};
