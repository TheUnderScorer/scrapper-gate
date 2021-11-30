import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { ElementHandle, Page } from 'playwright';
import { FieldHandler } from '../../fields.types';
import { FieldsHandler } from '../../FieldsHandler';
import { getFieldsHandlerForRule } from './getFieldsHandlerForRule';

export interface CreateConditionalRuleHandlerParams<Rule> {
  createFieldsHandler: (
    nameCreator: FieldNameCreator,
    page: Page,
    rule: Rule
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => FieldsHandler<any>;
  getInputValue: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fieldsHandler: FieldsHandler<any>,
    fieldNameCreator: FieldNameCreator
  ) => Promise<Rule>;
}

export const createConditionalRuleFieldHandler =
  <Rule>({
    createFieldsHandler,
    getInputValue,
  }: CreateConditionalRuleHandlerParams<Rule>) =>
  (rule: Rule): FieldHandler<HTMLElement, Rule> => {
    const getFieldsHandler = async (
      container: ElementHandle,
      rule: Rule,
      page: Page
    ) =>
      getFieldsHandlerForRule({
        container,
        createFieldsHandler: (...args) => createFieldsHandler(...args, rule),
        page,
      });

    return {
      providedValue: rule,
      fill: async (element, page) => {
        const { fieldsHandler } = await getFieldsHandler(element, rule, page);

        await fieldsHandler.fillAll();
      },
      getInputValue: async (element, page) => {
        const { fieldsHandler, fieldNameCreator } = await getFieldsHandler(
          element,
          rule,
          page
        );

        return getInputValue(fieldsHandler, fieldNameCreator);
      },
    };
  };
