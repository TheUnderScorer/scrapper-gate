import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Info, Language, MyLocation } from '@material-ui/icons';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import {
  FieldNameCreator,
  FormSwitch,
  FormTextFieldBlockProps,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { NodeContentProps, TooltipText } from '@scrapper-gate/frontend/ui';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';
import { useLocation } from 'react-use';
import { useIsOnStepUrl } from '../../../hooks/useIsOnStepUrl';

export interface UrlProps
  extends Pick<NodeContentProps, 'nodeIndex'>,
    Pick<
      Partial<FormTextFieldBlockProps>,
      'name' | 'label' | 'disabled' | 'helperText'
    > {
  fieldNameCreator: FieldNameCreator;
  allowPreviousStepUrl?: boolean;
  initialValue?: string;
}

const useStyles = makeStyles((theme) => ({
  label: {
    marginRight: 0,
  },
  infoBtn: {
    marginLeft: theme.spacing(1),
  },
}));

export const Url = ({
  disabled,
  fieldNameCreator,
  name = 'url',
  label = 'Url',
  allowPreviousStepUrl = true,
  initialValue,
  ...rest
}: UrlProps) => {
  const classes = useStyles();

  const useUrlFromPreviousStep = useFormFieldValue<boolean>(
    fieldNameCreator('useUrlFromPreviousStep')
  );

  const {
    input: { onChange, value },
  } = useField<string>(fieldNameCreator(name), {
    initialValue,
  });

  const location = useLocation();

  const fillWithLocation = useCallback(() => {
    onChange(location.href);
  }, [onChange, location]);

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
        label={label}
        name={fieldNameCreator(name)}
        disabled={urlDisabled}
        {...rest}
      />
      {allowPreviousStepUrl && (
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
        >
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
          {!isOnStepUrl && !disabled && value && (
            <Button href={value}>Open step URL</Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};
