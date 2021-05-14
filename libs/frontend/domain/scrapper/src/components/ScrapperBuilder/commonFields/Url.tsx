import React, { useCallback } from 'react';

import { IconButton, InputAdornment, Stack, Tooltip } from '@material-ui/core';
import { Info, Language, MyLocation } from '@material-ui/icons';
import { useField } from 'react-final-form';
import { makeStyles } from '@material-ui/core/styles';
import {
  FieldNameCreator,
  FormSwitch,
  FormTextField,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { NodeContentProps, TooltipText } from '@scrapper-gate/frontend/ui';
import { useLocation } from 'react-use';

export interface UrlProps extends Pick<NodeContentProps, 'nodeIndex'> {
  disabled?: boolean;
  fieldNameCreator: FieldNameCreator;
}

const useStyles = makeStyles((theme) => ({
  label: {
    marginRight: 0,
  },
  infoBtn: {
    marginLeft: theme.spacing(1),
  },
}));

export const Url = ({ disabled, fieldNameCreator }: UrlProps) => {
  const classes = useStyles();

  const useUrlFromPreviousStep = useFormFieldValue<boolean>(
    fieldNameCreator('useUrlFromPreviousStep')
  );

  const {
    input: { onChange },
  } = useField<string>(fieldNameCreator('url'));

  const location = useLocation();

  const fillWithLocation = useCallback(() => {
    onChange(location.href);
  }, [location, onChange]);

  const urlDisabled = disabled || useUrlFromPreviousStep;

  return (
    <Stack spacing={1} direction="column">
      <FormTextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Language />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip
                placement="top"
                arrow
                title={<TooltipText>Fill with current URL</TooltipText>}
              >
                <span>
                  <IconButton disabled={urlDisabled} onClick={fillWithLocation}>
                    <MyLocation />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        label="Url"
        name={fieldNameCreator('url')}
        disabled={urlDisabled}
      />
      <Stack direction="row" spacing={1}>
        <FormSwitch
          labelProps={{
            className: classes.label,
          }}
          name={fieldNameCreator('useUrlFromPreviousStep')}
          label="Stay on page from previous step"
          disabled={disabled}
        />
        <IconButton className={classes.infoBtn} size="small">
          <Info />
        </IconButton>
      </Stack>
    </Stack>
  );
};
