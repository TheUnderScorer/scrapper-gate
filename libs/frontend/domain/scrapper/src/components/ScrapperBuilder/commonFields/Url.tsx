import { Info, Language, MyLocation } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
} from '@mui/material';
import { BlockEditorProps } from '@scrapper-gate/frontend/block-editor';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import { NodeContentProps } from '@scrapper-gate/frontend/flow-builder';
import {
  FieldNameCreator,
  FormSwitch,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { TooltipText } from '@scrapper-gate/frontend/ui';
import React, { useCallback } from 'react';
import { useField } from 'react-final-form';
import { useLocation } from 'react-use';
import { useIsOnStepUrl } from '../../../hooks/useIsOnStepUrl';
import { useCanUseUrlFromPrevStep } from '../hooks/useCanUseUrlFromPrevStep';

export interface UrlProps
  extends Pick<NodeContentProps, 'nodeIndex'>,
    Pick<
      Partial<BlockEditorProps>,
      'name' | 'label' | 'disabled' | 'helperText'
    > {
  fieldNameCreator: FieldNameCreator;
  allowPreviousStepUrl?: boolean;
  initialValue?: string;
}

export const Url = ({
  disabled,
  fieldNameCreator,
  name = 'url',
  label = 'Url',
  allowPreviousStepUrl = true,
  initialValue,
  ...rest
}: UrlProps) => {
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

  const canUsePreviousStepUrl = useCanUseUrlFromPrevStep(rest.nodeIndex);

  return (
    <Stack spacing={1} direction="column">
      <VariablesTextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Language />
            </InputAdornment>
          ),
          endAdornment: !isOnStepUrl && (
            <InputAdornment position="end">
              <Tooltip
                placement="top"
                arrow
                title={<TooltipText>Fill with current URL</TooltipText>}
              >
                <span>
                  <IconButton
                    disabled={urlDisabled}
                    onClick={fillWithLocation}
                    size="large"
                  >
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

      <Stack alignItems="center" direction="row" justifyContent="space-between">
        {allowPreviousStepUrl && canUsePreviousStepUrl && (
          <Stack direction="row" spacing={1}>
            <FormSwitch
              labelProps={{
                sx: {
                  marginRight: 0,
                },
              }}
              name={fieldNameCreator('useUrlFromPreviousStep')}
              label="Stay on page from previous step"
              disabled={disabled}
            />
            <IconButton
              sx={{
                marginLeft: (theme) => theme.spacing(1),
              }}
              size="small"
            >
              <Info />
            </IconButton>
          </Stack>
        )}
        {!isOnStepUrl && !disabled && value && (
          <Button href={value}>Open step URL</Button>
        )}
      </Stack>
    </Stack>
  );
};
