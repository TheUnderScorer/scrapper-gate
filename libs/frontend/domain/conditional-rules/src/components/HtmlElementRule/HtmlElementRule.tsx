import React, { useEffect, useMemo } from 'react';
import {
  ConditionalRuleDefinitionsProps,
  HtmlElementWhat,
} from '@scrapper-gate/frontend/domain/conditional-rules';
import {
  HtmlElementPicker,
  HtmlElementPickerProps,
} from '@scrapper-gate/frontend/ui';
import { MenuItem, Stack, Typography } from '@material-ui/core';
import {
  EnumSelect,
  FormSelect,
  FormTextField,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import { BaseConditionalRuleWhen } from '@scrapper-gate/shared/domain/conditional-rules';
import { makeStyles } from '@material-ui/core/styles';
import { useField } from 'react-final-form';
import { valueSupportedWhen } from '../../valueSupportedWhen';
import { isHtmlAttribute } from '@scrapper-gate/shared/validation';
import {
  ConditionalRuleGroupType,
  Selector,
} from '@scrapper-gate/shared/schema';
import { ruleLabels } from '../../labels';

export interface HtmlElementRuleProps
  extends ConditionalRuleDefinitionsProps,
    Omit<HtmlElementPickerProps, 'name'> {}

const useStyles = makeStyles((theme) => ({
  select: {
    minWidth: '150px',
  },
  htmlPicker: {
    marginTop: `${theme.spacing(4)} !important`,
  },
}));

export const HtmlElementRule = ({
  definition,
  getName,
  spacing,
  fieldVariant,
  ...rest
}: HtmlElementRuleProps) => {
  const classes = useStyles();

  const selectors = useFormFieldValue<Selector[]>(getName('meta.selectors'));
  const whatValue = useFormFieldValue(getName('what'));

  const {
    input: { onChange: onChangeWhen, value: whenValue },
  } = useField(getName('when'));

  const whenOptions = useMemo(() => {
    if (!whatValue) {
      return [
        BaseConditionalRuleWhen.Exists,
        BaseConditionalRuleWhen.NotExists,
      ];
    }

    return Object.values(BaseConditionalRuleWhen);
  }, [whatValue]);

  const supportsValue = useMemo(() => {
    return whatValue && valueSupportedWhen.includes(whenValue);
  }, [whatValue, whenValue]);

  useEffect(() => {
    if (!whatValue && !whenOptions.includes(whenValue)) {
      onChangeWhen(BaseConditionalRuleWhen.Exists);
    }
  }, [onChangeWhen, whatValue, whenOptions, whenValue]);

  return (
    <Stack direction="column" spacing={spacing}>
      <Stack direction="row" alignItems="baseline" spacing={spacing}>
        <Typography>Element</Typography>
        <EnumSelect
          className={classes.select}
          label={ruleLabels.what}
          emptyOptionLabel="None"
          defaultValue=""
          variant={fieldVariant}
          enumObj={HtmlElementWhat}
          name={getName('what')}
        />
        {whatValue === HtmlElementWhat.Attribute && (
          <FormTextField
            helperText="For example: class"
            variant={fieldVariant}
            name={getName('meta.attribute')}
            label="Attribute"
            validate={(value) => {
              if (value && !isHtmlAttribute(value)) {
                return new Error('Invalid attribute provided.');
              }
            }}
          />
        )}

        <EnumSelect
          className={classes.select}
          label={ruleLabels.when}
          defaultValue={BaseConditionalRuleWhen.Exists}
          variant={fieldVariant}
          enumObj={whenOptions}
          name={getName('when')}
        />
        {supportsValue && (
          <FormTextField
            variant={fieldVariant}
            name={getName('value')}
            label={ruleLabels.value}
          />
        )}
      </Stack>
      <HtmlElementPicker
        className={classes.htmlPicker}
        variant={fieldVariant}
        name={getName('meta.selectors')}
        {...rest}
      />
      {Boolean(selectors.length) && (
        <Stack spacing={spacing} direction="row" alignItems="center">
          <FormSelect
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
    </Stack>
  );
};