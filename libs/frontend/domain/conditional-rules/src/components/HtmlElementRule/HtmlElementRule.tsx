import { Box, Link, MenuItem, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { VariablesTextField } from '@scrapper-gate/frontend/domain/variables';
import {
  EnumSelect,
  FormSelect,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import {
  ExternalLink,
  HtmlElementPicker,
  HtmlElementPickerProps,
} from '@scrapper-gate/frontend/ui';
import {
  ConditionalRuleWhen,
  HtmlElementWhat,
} from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleGroupType,
  Selector,
} from '@scrapper-gate/shared/schema';
import React, { ReactNode, useEffect, useMemo } from 'react';
import { useField } from 'react-final-form';
import { ruleLabels } from '../../labels';
import { ConditionalRuleDefinitionsProps } from '../../types';
import { valueSupportedWhen } from '../../valueSupportedWhen';

const PREFIX = 'HtmlElementRule';

const classes = {
  select: `${PREFIX}-select`,
};

const StyledStack = styled(Stack)(() => ({
  [`& .${classes.select}`]: {
    minWidth: '150px',
  },
}));

export interface HtmlElementRuleProps
  extends ConditionalRuleDefinitionsProps,
    Omit<HtmlElementPickerProps, 'name'> {
  picker?: ReactNode;
}

export const HtmlElementRule = ({
  definition,
  getName,
  spacing,
  fieldVariant,
  picker,
  ...rest
}: HtmlElementRuleProps) => {
  const selectors = useFormFieldValue<Selector[]>(getName('meta.selectors'));
  const whatValue = useFormFieldValue(getName('what'));

  const {
    input: { onChange: onChangeWhen, value: whenValue },
  } = useField(getName('when'));

  const whenOptions = useMemo(() => {
    if (!whatValue) {
      return [ConditionalRuleWhen.Exists, ConditionalRuleWhen.NotExists];
    }

    return Object.values(ConditionalRuleWhen);
  }, [whatValue]);

  const supportsValue = useMemo(() => {
    return whatValue && valueSupportedWhen.includes(whenValue);
  }, [whatValue, whenValue]);

  useEffect(() => {
    if (!whatValue && !whenOptions.includes(whenValue)) {
      onChangeWhen(ConditionalRuleWhen.Exists);
    }
  }, [onChangeWhen, whatValue, whenOptions, whenValue]);

  return (
    <StyledStack direction="column" spacing={spacing}>
      <EnumSelect
        helperText={
          <>
            You can check if selected elements have a given attribute or tag
            name. <Link>Learn more</Link>
          </>
        }
        className={classes.select}
        label={ruleLabels.what}
        emptyOptionLabel="None"
        defaultValue=""
        variant={fieldVariant}
        enumObj={HtmlElementWhat}
        name={getName('what')}
      />
      {whatValue === HtmlElementWhat.Attribute && (
        <VariablesTextField
          helperText={
            <>
              Element attribute to check. For example: class or id.
              <ExternalLink href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes">
                Learn more about attributes
              </ExternalLink>
            </>
          }
          variant={fieldVariant}
          name={getName('meta.attribute')}
          label="Attribute"
        />
      )}

      <EnumSelect
        className={classes.select}
        label={ruleLabels.when}
        defaultValue={ConditionalRuleWhen.Exists}
        variant={fieldVariant}
        enumObj={whenOptions}
        name={getName('when')}
      />
      {supportsValue && (
        <VariablesTextField
          variant={fieldVariant}
          name={getName('value')}
          label={ruleLabels.value}
        />
      )}
      <Box width="100%">
        {picker ?? (
          <HtmlElementPicker
            label="Selectors"
            variant={fieldVariant}
            name={getName('meta.selectors')}
            {...rest}
          />
        )}
      </Box>
      {Boolean(selectors?.length) && (
        <Stack spacing={spacing} direction="row" alignItems="center">
          <FormSelect
            size="small"
            defaultValue={ConditionalRuleGroupType.Any}
            variant={fieldVariant}
            className={classes.select}
            name={getName('meta.type')}
          >
            <MenuItem value={ConditionalRuleGroupType.Any}>
              At least one
            </MenuItem>
            <MenuItem value={ConditionalRuleGroupType.All}>All</MenuItem>
          </FormSelect>
          <Typography>elements must match this condition.</Typography>
        </Stack>
      )}
    </StyledStack>
  );
};
