import { castAsDate, DateFormat } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleCondition,
  ConditionalRuleType,
  DateConditionalRule,
} from '@scrapper-gate/shared/schema';
import { format } from 'date-fns';
import { FieldsHandler } from '../../FieldsHandler';
import { blockEditorHandler } from '../blockEditorHandler';
import { selectHandler } from '../selectHandler';
import { createConditionalRuleFieldHandler } from './createConditionalRuleFieldHandler';

export const dateRuleHandler =
  createConditionalRuleFieldHandler<DateConditionalRule>({
    createFieldsHandler: (fieldNameCreator, page, rule) =>
      new FieldsHandler(
        {
          [fieldNameCreator('expectedDate')]: {
            handler: blockEditorHandler(
              format(castAsDate(rule.expectedDate), DateFormat.Date)
            ),
          },
          [fieldNameCreator('condition')]: {
            handler: selectHandler(rule.condition),
          },
        },
        page
      ),
    getInputValue: async (fieldsHandler, fieldNameCreator) => ({
      ruleType: ConditionalRuleType.Date,
      expectedDate: format(
        castAsDate(
          await fieldsHandler.getValue(fieldNameCreator('expectedDate'))
        ),
        DateFormat.Date
      ),
      condition: (await fieldsHandler.getValue(
        fieldNameCreator('condition')
      )) as ConditionalRuleCondition,
    }),
  });
