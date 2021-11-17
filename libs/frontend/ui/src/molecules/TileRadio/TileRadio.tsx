import { Checkbox, Fade, Stack, Typography } from '@mui/material';
import classNames from 'classnames';
import React from 'react';
import { SelectablePaper } from '../SelectablePaper/SelectablePaper';
import { TileRadioProps } from './TileRadio.types';

export const TileRadio = ({
  icon,
  title,
  children,
  description,
  ...props
}: TileRadioProps) => {
  return (
    <SelectablePaper
      {...props}
      className={props.className}
      paperProps={{
        ...props?.paperProps,
        sx: {
          textAlign: 'center',
          position: 'relative',
          ...props?.sx,
        },
      }}
    >
      <Fade in={props.checked}>
        <Checkbox
          sx={{
            position: 'absolute',
            top: '0',
            right: '0',
            zIndex: (theme) => theme.zIndex.tooltip,
            pointerEvents: 'none',
            color: (theme) =>
              props?.checkedBackgroundColor === 'primary'
                ? theme.palette.primary.contrastText
                : undefined,
          }}
          checked={props.checked}
          disabled={props.disabled}
          color={
            props?.checkedBackgroundColor === 'primary' ? 'default' : 'primary'
          }
          className={classNames('tile-radio-checkbox', 'vertical')}
        />
      </Fade>
      <Stack
        alignItems="center"
        spacing={1}
        direction="column"
        sx={{
          userSelect: 'none',
        }}
      >
        <span className="tile-radio-icon">{icon}</span>
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
