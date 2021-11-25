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

export const VariableConditionalRuleSchema =
  joi.object<VariableConditionalRule>({
    ...base,
    variableKey: noSpecialChars({
      schema: joi.string().required(),
    }),
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
          omit(variable, ['createdAt', 'deletedAt', 'updatedAt'])
        );

        clonedVariable.value = value;

        const result = VariableInputSchema.validate(clonedVariable, {
          context: helpers.prefs.context,
        });

        if (result.error) {
          return helpers.error(first(result.error.details).type);
        }
      }

      return value;
    }),
  });
