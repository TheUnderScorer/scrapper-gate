import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import { ElementHandle, Page } from 'playwright';
import { FieldsHandler } from '../../FieldsHandler';

export interface GetFieldsHandlerForRuleParams {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createFieldsHandler: (
    nameCreator: FieldNameCreator,
    page: Page
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) => FieldsHandler<any>;
  container: ElementHandle;
  page: Page;
}

export const getFieldsHandlerForRule = async ({
  createFieldsHandler,
  container,
  page,
}: GetFieldsHandlerForRuleParams) => {
  const index = Number(await container.getAttribute('data-index'));
  const baseName = await container.getAttribute('data-name');

  if (Number.isNaN(index)) {
    throw new Error('Unable to determine rule index');
  }

  if (!baseName) {
    throw new Error('Unable to determine rule name');
  }

  const fieldNameCreator: FieldNameCreator = (name) => baseName + name;

  const fieldsHandler = createFieldsHandler(fieldNameCreator, page);

  return {
    fieldsHandler,
    fieldNameCreator,
  };
};
