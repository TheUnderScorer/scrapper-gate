import { makeGetFieldName } from '@scrapper-gate/frontend/flow-builder';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import {
  MouseButton,
  ScrapperAction,
  ScrapperStepInput,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { ElementHandle, Page } from 'playwright';
import { map, pipe } from 'remeda';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';
import { FieldsHandler } from '../../../utils/fields/FieldsHandler';
import { blockEditorHandler } from '../../../utils/fields/handlers/blockEditorHandler';
import { selectHandler } from '../../../utils/fields/handlers/selectHandler';
import { textFieldHandler } from '../../../utils/fields/handlers/textFieldHandler';
import { changeRunSettings } from './actionFieldHandlersCreators/changeRunSettings';
import { getCommonStepHandlers } from './actionFieldHandlersCreators/commonStepHandlers';
import { screenshot } from './actionFieldHandlersCreators/screenshot';
import { waitSection } from './actionFieldHandlersCreators/wait';

interface ScrapperFieldHandlerForActionParams {
  action: ScrapperAction;
  node: ElementHandle;
  scraperPage: ScrapperBuilderPage;
  input?: Partial<ScrapperStepInput>;
  page: Page;
}

// TODO Inclue Conditional action after refactor
const getFieldHandlersMapForAction = async (
  params: ScrapperFieldHandlerForActionParams & {
    fieldNameCreator: FieldNameCreator;
  }
) => {
  const { fieldNameCreator, input, action } = params;

  const commonFields = await getCommonStepHandlers(fieldNameCreator, input);
  const { keyHandler, url, selectors, valueType } = commonFields;

  switch (action) {
    case ScrapperAction.Click:
      return {
        ...keyHandler,
        ...url,
        ...selectors,
        [fieldNameCreator('clickTimes')]: {
          handler: textFieldHandler(
            input?.clickTimes ?? faker.datatype.number(4)
          ),
        },
        [fieldNameCreator('mouseButton')]: {
          handler: selectHandler(faker.random.objectElement(MouseButton)),
        },
      };

    case ScrapperAction.ReadText:
      return {
        ...keyHandler,
        ...url,
        ...selectors,
        ...valueType,
      };

    case ScrapperAction.ChangeRunSettings:
      return changeRunSettings(fieldNameCreator, commonFields);

    case ScrapperAction.NavigateTo:
      return {
        ...keyHandler,
        ...url,
      };

    case ScrapperAction.GoBack: {
      return {
        ...keyHandler,
      };
    }

    case ScrapperAction.Wait: {
      return waitSection(fieldNameCreator, commonFields);
    }

    case ScrapperAction.ReadAttribute:
      return {
        ...keyHandler,
        ...url,
        ...valueType,
        ...selectors,
        [fieldNameCreator('attributeToRead')]: {
          handler: blockEditorHandler(faker.random.word()),
        },
      };

    case ScrapperAction.ReloadPage: {
      return {
        ...keyHandler,
      };
    }

    case ScrapperAction.Screenshot: {
      return screenshot(fieldNameCreator, commonFields);
    }
  }
};

export const getScrapperFieldHandlerForAction = async (
  params: ScrapperFieldHandlerForActionParams
) => {
  const { action, node, scraperPage, page } = params;

  const nodeIndex = await scraperPage.getNodeIndex(node);
  const fieldNameCreator = makeGetFieldName(nodeIndex);

  const fieldsMap = await getFieldHandlersMapForAction({
    ...params,
    fieldNameCreator,
  });

  if (!fieldsMap) {
    throw new TypeError(`No field handlers defined for ${action}`);
  }

  return {
    handler: new FieldsHandler(fieldsMap, page),
    fieldsMap: fieldsMap,
    nodeIndex,
    fieldNameCreator,
    // Provides option to retrieve new handler after form was submitted, which might result in node index change
    getHandlerForIndex: (index: number) => {
      const newFieldNameCreator = makeGetFieldName(index);
      const baseName = fieldNameCreator();

      const newFields = pipe(
        Object.entries(fieldsMap),
        map(([key, value]) => {
          const propertyName = key.replace(`${baseName}.`, '');

          return [newFieldNameCreator(propertyName), value];
        }),
        Object.fromEntries
      );

      return new FieldsHandler(newFields, page);
    },
  };
};
