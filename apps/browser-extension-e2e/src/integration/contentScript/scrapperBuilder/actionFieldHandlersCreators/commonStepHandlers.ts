import { repeat, UnpackPromise } from '@scrapper-gate/shared/common';
import { ScrapperStepInput, VariableType } from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { uniq } from 'remeda';
import { FieldHandlerMapEntry } from '../../../../utils/fields/fields.types';
import { blockEditorHandler } from '../../../../utils/fields/handlers/blockEditorHandler';
import { elementPickerHandler } from '../../../../utils/fields/handlers/elementPickerHandler';
import { selectHandler } from '../../../../utils/fields/handlers/selectHandler';
import { textFieldHandler } from '../../../../utils/fields/handlers/textFieldHandler';

const possibleSelectors = ['div', 'a', 'span', 'main', '#root', 'button'];

export type CommonStepHandlers = UnpackPromise<
  ReturnType<typeof getCommonStepHandlers>
>;

export async function getCommonStepHandlers(
  fieldNameCreator: (name?: string) => string,
  input?: Partial<ScrapperStepInput>
) {
  const keyHandler: Record<string, FieldHandlerMapEntry> = {
    [fieldNameCreator('key')]: {
      handler: textFieldHandler(input?.key ?? faker.random.word()),
    },
  };

  const url: Record<string, FieldHandlerMapEntry> = {
    [fieldNameCreator('url')]: {
      handler: blockEditorHandler(input?.url ?? faker.internet.url()),
    },
  };

  const selectorsOptions = await repeat(faker.datatype.number(5), () =>
    faker.random.arrayElement(possibleSelectors)
  );
  const selectors: Record<string, FieldHandlerMapEntry> = {
    [fieldNameCreator('selectors')]: {
      handler: elementPickerHandler(uniq(selectorsOptions), 'type'),
    },
  };

  const valueType = {
    [fieldNameCreator('valueType')]: {
      handler: selectHandler(faker.random.objectElement(VariableType)),
    },
  };

  return { keyHandler, url, selectors, valueType };
}
