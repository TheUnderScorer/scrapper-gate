import React, { ReactNode, useCallback } from 'react';
import { useField } from 'react-final-form';
import {
  Box,
  Button,
  Grid,
  Input,
  InputLabel,
  Typography,
} from '@material-ui/core';
import { Add, Remove } from '@material-ui/icons';
import classNames from 'classnames';
import { useStyles } from './Incrementator.styles';
import { useLongPressValue } from '@scrapper-gate/frontend/common';

export interface IncrementatorProps {
  name: string;
  disabled?: boolean;
  bottomText?: ReactNode;
  minValue?: number;
  initialValue?: number;
  label?: string;
}

export const Incrementator = ({
  disabled,
  name,
  bottomText,
  minValue = 0,
  initialValue,
  label,
}: IncrementatorProps) => {
  const classes = useStyles();

  const { input } = useField(name, {
    type: 'number',
    parse: (value) => {
      const parsed = parseInt(value, 10);

      if (parsed < minValue || Number.isNaN(parsed)) {
        return minValue;
      }

      return parsed;
    },
    allowNull: true,
    initialValue,
  });

  const handleButtonClick = useCallback(
    (action: 'increment' | 'decrement') => () => {
      let newValue = input.value ?? 0;

      if (action === 'increment') {
        newValue += 1;
      } else {
        newValue -= 1;
      }

      input.onChange(newValue);
    },
    [input]
  );

  const incrementHandlers = useLongPressValue<number>({
    onLongPress: (prevValue) => {
      const value = prevValue ? prevValue + 1 : 1;

      input.onChange(value);

      return value;
    },
    currentValue: input.value,
  });

  const decrementHandlers = useLongPressValue<number>({
    onLongPress: (prevValue) => {
      const value = prevValue ? prevValue - 1 : 1;

      input.onChange(value);

      return value;
    },
    currentValue: input.value,
  });

  return (
    <Box display="inline-block">
      {label && (
        <Box mb={2}>
          <InputLabel>{label}</InputLabel>
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item>
          <Button
            onMouseDown={decrementHandlers.handleMouseDown}
            onMouseUp={decrementHandlers.handleMouseUp}
            onMouseLeave={decrementHandlers.handleMouseUp}
            className="incrementator-decrement"
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleButtonClick('decrement')}
            disabled={disabled}
          >
            <Remove />
          </Button>
        </Grid>
        <Grid item>
          <Box width="50px">
            <Input
              className={classNames(classes.input, 'incrementator-input')}
              disabled={disabled}
              type="number"
              {...input}
            />
          </Box>
        </Grid>
        <Grid item>
          <Button
            onMouseDown={incrementHandlers.handleMouseDown}
            onMouseUp={incrementHandlers.handleMouseUp}
            onMouseLeave={incrementHandlers.handleMouseUp}
            className="incrementator-increment"
            variant="outlined"
            size="small"
            color="primary"
            onClick={handleButtonClick('increment')}
            disabled={disabled}
          >
            <Add />
          </Button>
        </Grid>
      </Grid>
      {bottomText && (
        <Box mt={2} textAlign="center">
          <Typography color="textSecondary" variant="caption">
            {bottomText}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
