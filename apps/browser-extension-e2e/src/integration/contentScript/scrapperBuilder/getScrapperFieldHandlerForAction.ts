import { makeGetFieldName } from '@scrapper-gate/frontend/flow-builder';
import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import {
  MouseButton,
  ScrapperAction,
  ScrapperStepInput,
  Variable,
} from '@scrapper-gate/shared/schema';
import * as faker from 'faker';
import { ElementHandle, Page } from 'playwright';
import { map, pipe } from 'remeda';
import { FieldsHandler } from '../../../fields/FieldsHandler';
import { blockEditorHandler } from '../../../fields/handlers/blockEditorHandler';
import { checkboxHandler } from '../../../fields/handlers/checkboxHandler';
import { iframeCodeEditorHandler } from '../../../fields/handlers/iframeCodeEditorHandler';
import { selectHandler } from '../../../fields/handlers/selectHandler';
import { textFieldHandler } from '../../../fields/handlers/textFieldHandler';
import { ScrapperBuilderPage } from '../../../pages/ScrapperBuilderPage';
import { changeRunSettings } from './actionFieldHandlersCreators/changeRunSettings';
import { getCommonStepHandlers } from './actionFieldHandlersCreators/commonStepHandlers';
import { condition } from './actionFieldHandlersCreators/condition';
import { screenshot } from './actionFieldHandlersCreators/screenshot';
import { waitSection } from './actionFieldHandlersCreators/wait';
import { createScrapperVariables } from './createScrapperVariables';

interface ScrapperFieldHandlerForActionParams {
  action: ScrapperAction;
  node: ElementHandle;
  scrapperPage: ScrapperBuilderPage;
  input?: Partial<ScrapperStepInput>;
  page: Page;
}

const getFieldHandlersMapForAction = async (
  params: ScrapperFieldHandlerForActionParams & {
    fieldNameCreator: FieldNameCreator;
    variables: Variable[];
  }
) => {
  const { fieldNameCreator, input, action, variables } = params;

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

    case ScrapperAction.RunJavascript:
      return {
        ...keyHandler,
        ...url,
        [fieldNameCreator('jsCode')]: {
          handler: iframeCodeEditorHandler(
            input?.jsCode ?? `const runStep = () => ({values: ['test']})`
          ),
        },
      };

    case ScrapperAction.Type:
      return {
        ...keyHandler,
        ...url,
        ...selectors,
        [fieldNameCreator('clearInputBeforeTyping')]: {
          handler: checkboxHandler(faker.datatype.boolean()),
        },
        [fieldNameCreator('typeValue')]: {
          handler: blockEditorHandler(input?.typeValue ?? faker.random.word()),
        },
        [fieldNameCreator('typeDelay')]: {
          handler: textFieldHandler(
            input?.typeDelay ?? faker.datatype.number(999)
          ),
        },
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
      return waitSection(fieldNameCreator, commonFields, variables);
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

    case ScrapperAction.Condition: {
      return condition(fieldNameCreator, commonFields, variables);
    }
  }
};

export const getScrapperFieldHandlerForAction = async (
  params: ScrapperFieldHandlerForActionParams
) => {
  const { action, node, scrapperPage, page } = params;

  const nodeIndex = await scrapperPage.getNodeIndex(node);
  const fieldNameCreator = makeGetFieldName(nodeIndex);

  const variables = await createScrapperVariables(scrapperPage);

  const fieldsMap = await getFieldHandlersMapForAction({
    ...params,
    fieldNameCreator,
    variables,
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
