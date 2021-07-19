import { Checkbox, Fade, Stack, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import React from 'react';
import { SelectablePaper } from '../SelectablePaper/SelectablePaper';
import { TileRadioProps } from './TileRadio.types';

const useStyles = makeStyles((theme) => ({
  text: {
    userSelect: 'none',
  },
  paper: {
    textAlign: 'center',
    position: 'relative',
  },
  checkbox: ({
    checkedBackgroundColor,
  }: Pick<TileRadioProps, 'checkedBackgroundColor'>) => ({
    position: 'absolute',
    top: '0',
    right: '0',
    zIndex: 2,
    pointerEvents: 'none',
    color:
      checkedBackgroundColor === 'primary'
        ? theme.palette.primary.contrastText
        : undefined,
  }),
}));

export const TileRadio = ({
  icon,
  title,
  children,
  description,
  ...paperProps
}: TileRadioProps) => {
  const classes = useStyles({
    checkedBackgroundColor: paperProps?.checkedBackgroundColor,
  });

  return (
    <SelectablePaper
      {...paperProps}
      className={classNames(classes.paper, paperProps.className)}
    >
      <Fade in={paperProps.checked}>
        <Checkbox
          checked={paperProps.checked}
          disabled={paperProps.disabled}
          color={
            paperProps?.checkedBackgroundColor === 'primary'
              ? 'default'
              : 'primary'
          }
          className={classNames(
            classes.checkbox,
            'tile-radio-checkbox',
            'vertical'
          )}
        />
      </Fade>
      <Stack
        alignItems="center"
        spacing={1}
        direction="column"
        className={classes.text}
      >
        {icon}
        <Typography variant={description ? 'h6' : 'body2'}>{title}</Typography>
        {description && (
          <Typography className="no-bold" whiteSpace="pre-line" variant="body2">
            {description}
          </Typography>
        )}
      </Stack>

      {children}
    </SelectablePaper>
  );
};
