import { first } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleType,
  Variable,
  VariableConditionalRule,
} from '@scrapper-gate/shared/schema';
import joi from 'joi';
import { clone, omit } from 'remeda';
import { noSpecialChars } from '../../modifiers/noSpecialChars';
import { VariableInputSchema } from '../variables/VariableInput.schema';
import { getBaseConditionalRuleMap } from './baseConditionalRuleMap';

const base = getBaseConditionalRuleMap(ConditionalRuleType.Variable);

export const VariableConditionalRuleSchema = joi.object<
  VariableConditionalRule & { __typename: string }
>({
  ...base,
  variableKey: noSpecialChars({
    schema: joi.string().required(),
  }),
  __typename: joi.string(),
  expectedValue: joi.any().custom((value, helpers) => {
    const variables = helpers.prefs.context?.variables as Variable[];

    if (!variables?.length) {
      return value;
    }

    const expectedKey = first(
      helpers.state.ancestors as [VariableConditionalRule]
    )?.variableKey;
    const variable = variables.find((v) => v.key === expectedKey);

    if (variable) {
      const clonedVariable = clone(
        omit(variable as Variable & { __typename: string }, [
          'createdAt',
          'deletedAt',
          'updatedAt',
          '__typename',
        ])
      );

      clonedVariable.value = value;

      const result = VariableInputSchema.validate(clonedVariable, {
        context: helpers.prefs.context,
        allowUnknown: true,
      });

      if (result.error) {
        return helpers.error(first(result.error.details).type);
      }
    }

    return value;
  }),
});
