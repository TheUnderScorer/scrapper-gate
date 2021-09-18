import { Check } from '@mui/icons-material';
import {
  ClickAwayListener,
  IconButton,
  Stack,
  TextField,
  TextFieldProps,
  Tooltip,
  Typography,
  TypographyProps,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import classNames from 'classnames';
import React, { useCallback, useState } from 'react';
import { useField } from 'react-final-form';
import { useBoolean } from 'react-use';
import { Key } from 'ts-key-enum';

const PREFIX = 'FormEditableText';

const classes = {
  text: `${PREFIX}-text`,
};

const StyledClickAwayListener = styled(ClickAwayListener)(() => ({
  [`& .${classes.text}`]: {
    cursor: 'pointer',
  },
}));

export interface FormEditableTextProps extends Omit<TextFieldProps, 'name'> {
  onEditFinish?: (value: string) => unknown;
  textProps?: TypographyProps;
  name: string;
}

export const FormEditableText = ({
  onEditFinish,
  className,
  textProps,
  name,
  variant,
  ...rest
}: FormEditableTextProps) => {
  const {
    input: { value, onChange },
  } = useField(name);
  const [internalValue, setInternalValue] = useState(value ?? '');

  const [isEdit, toggleIsEdit] = useBoolean(false);

  const finishEdit = useCallback(() => {
    toggleIsEdit(false);

    if (internalValue === value) {
      return;
    }

    if (!internalValue) {
      setInternalValue(value);

      return;
    }

    onEditFinish?.(internalValue);
    onChange(internalValue);
  }, [internalValue, onChange, onEditFinish, toggleIsEdit, value]);

  return (
    <StyledClickAwayListener onClickAway={() => finishEdit()}>
      <span className={className}>
        {!isEdit && (
          <Tooltip title="Click to edit">
            <Typography
              className={classNames(classes.text, 'form-editable-text')}
              onClick={() => toggleIsEdit(true)}
              {...textProps}
            >
              {value ?? rest.defaultValue}
            </Typography>
          </Tooltip>
        )}
        {isEdit && (
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              value={internalValue}
              onChange={(event) => {
                setInternalValue(event.target.value);
              }}
              {...rest}
              variant={variant}
              className="form-editable-text-field"
              inputProps={{
                onKeyDown: (event) => {
                  switch (event.key) {
                    case Key.Enter:
                      event.preventDefault();

                      finishEdit();

                      break;

                    case Key.Escape:
                      toggleIsEdit(false);
                  }
                },
              }}
              ref={(input) => {
                input?.querySelector('input')?.focus();
              }}
            />
            <Tooltip title="Finish edit">
              <IconButton size="small" onClick={() => finishEdit()}>
                <Check />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      </span>
    </StyledClickAwayListener>
  );
};
