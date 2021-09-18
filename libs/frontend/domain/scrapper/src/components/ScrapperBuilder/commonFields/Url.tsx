import { Info, Language, MyLocation } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  Stack,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'Url';

const classes = {
  label: `${PREFIX}-label`,
  infoBtn: `${PREFIX}-infoBtn`,
};

const StyledStack = styled(Stack)(({ theme }) => ({
  [`& .${classes.label}`]: {
    marginRight: 0,
  },

  [`& .${classes.infoBtn}`]: {
    marginLeft: theme.spacing(1),
  },
}));

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

  return (
    <StyledStack spacing={1} direction="column">
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
    </StyledStack>
  );
};
