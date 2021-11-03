import { ConditionalRules } from '@scrapper-gate/frontend/domain/conditional-rules';
import { ScrapperStepFormProps } from '@scrapper-gate/frontend/domain/scrapper';
import {
  EnumSelect,
  FormDurationInputField,
  useFormFieldValue,
} from '@scrapper-gate/frontend/form';
import {
  ConditionalRuleGroupType,
  Maybe,
  ScrapperWaitType,
} from '@scrapper-gate/shared/schema';
import React from 'react';
import { scrapperActionIcons } from '../../../dictionary/scrapperActionIcons';
import { useScrapperConditionalRules } from '../../../hooks/useScrapperConditionalRules';
import { Url } from '../commonFields/Url';

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
      <EnumSelect
        enumObj={ScrapperWaitType}
        dictionary={{
          [ScrapperWaitType.Time]: {
            icon: scrapperActionIcons.Wait,
          },
          [ScrapperWaitType.Condition]: {
            icon: scrapperActionIcons.Condition,
          },
        }}
        name={fieldNameCreator('waitType')}
        label="Wait type"
      />
      {waitType === ScrapperWaitType.Condition && (
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
      )}
      {waitType === ScrapperWaitType.Time && (
        <FormDurationInputField
          label="Wait time"
          name={fieldNameCreator('waitDuration')}
        />
      )}
      <Url fieldNameCreator={fieldNameCreator} nodeIndex={nodeIndex} />
    </>
  );
};
