import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Info, Language, MyLocation } from '@material-ui/icons';
import { useIsOnStepUrl } from '../../../hooks/useIsOnStepUrl';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import {
  FieldNameCreator,
  FormSwitch,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { NodeContentProps, TooltipText } from '@scrapper-gate/frontend/ui';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';
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
    input: { onChange, value },
  } = useField<string>(fieldNameCreator('url'));

  const location = useLocation();

  const fillWithLocation = useCallback(() => {
    onChange(location.href);
  }, [location, onChange]);

  const urlDisabled = disabled || useUrlFromPreviousStep;

  const isOnStepUrl = useIsOnStepUrl({
    url: value,
    useUrlFromPreviousStep,
  });

  return (
    <Stack spacing={1} direction="column">
      <VariablesTextField
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
      <Stack alignItems="center" direction="row" justifyContent="space-between">
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
        {!isOnStepUrl && !disabled && (
          <Button href={value}>Open step URL</Button>
        )}
      </Stack>
    </Stack>
  );
};
