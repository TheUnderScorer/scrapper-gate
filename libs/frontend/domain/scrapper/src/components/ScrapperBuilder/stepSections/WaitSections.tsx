import { ConditionalRules } from '@scrapper-gate/frontend/domain/conditional-rules';
import {
  EnumSelect,
  FormDurationInputField,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import {
  ConditionalRuleGroupType,
  DurationUnit,
  Maybe,
  ScrapperWaitType,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { scrapperActionIcons } from '../../../dictionary/scrapperActionIcons';
import { useScrapperConditionalRules } from '../../../hooks/useScrapperConditionalRules';
import { ScrapperKey } from '../commonFields/ScrapperKey';
import { Url } from '../commonFields/Url';
import { ScrapperStepFormProps } from '../ScrapperBuilder.types';

export const WaitSections = ({
  fieldNameCreator,
  ElementPicker,
  nodeIndex,
}: ScrapperStepFormProps) => {
  const waitType = useFormFieldValue<Maybe<ScrapperWaitType>>(
    fieldNameCreator('waitType')
  );

  const rules = useScrapperConditionalRules({
    ElementPicker,
    fieldNameCreator,
    nodeIndex,
  });

  return (
    <>
      <ScrapperKey fieldNameCreator={fieldNameCreator} />
      <EnumSelect
        enumObj={ScrapperWaitType}
        dictionary={{
          [ScrapperWaitType.Time]: {
            icon: scrapperActionIcons.Wait,
            label: 'Wait for given time',
          },
          [ScrapperWaitType.Condition]: {
            icon: scrapperActionIcons.Condition,
            label: 'Wait until given condition is true',
          },
        }}
        name={fieldNameCreator('waitType')}
        label="Wait type"
      />
      {waitType === ScrapperWaitType.Condition && (
        <>
          <FormDurationInputField
            helperText="How often this conditional rule should be checked."
            label="Interval"
            name={fieldNameCreator('waitIntervalCheck')}
            disabledUnits={[DurationUnit.Hours]}
          />
          <FormDurationInputField
            helperText="When the check should timeout."
            label="Timeout"
            name={fieldNameCreator('waitIntervalTimeout')}
            disabledUnits={[DurationUnit.Hours]}
          />
          <ConditionalRules
            label="Rules"
            helperText="Wait until these rules are true."
            definitions={rules}
            name={fieldNameCreator('conditionalRules')}
            fieldVariant="standard"
            initialValue={[
              {
                type: ConditionalRuleGroupType.Any,
                rules: [],
              },
            ]}
          />
        </>
      )}
      {waitType === ScrapperWaitType.Time && (
        <FormDurationInputField
          helperText="How long scrapper should wait."
          label="Wait time"
          name={fieldNameCreator('waitDuration')}
          disabledUnits={[DurationUnit.Hours]}
        />
      )}
      <Url fieldNameCreator={fieldNameCreator} nodeIndex={nodeIndex} />
    </>
  );
};
