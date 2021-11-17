import { FieldNameCreator } from '@scrapper-gate/frontend/form';
import {
  ScrapperDialogBehaviour,
  ScrapperNoElementsFoundBehavior,
} from '@scrapper-gate/shared/schema';
import faker from 'faker';
import { blockEditorHandler } from '../../../../utils/fields/handlers/blockEditorHandler';
import { selectHandler } from '../../../../utils/fields/handlers/selectHandler';
import { CommonStepHandlers } from './commonStepHandlers';

export const changeRunSettings = (
  fieldNameCreator: FieldNameCreator,
  commonFields: CommonStepHandlers
) => {
  const noElementsFoundBehaviour = faker.random.objectElement(
    ScrapperNoElementsFoundBehavior
  );
  const dialogBehaviour = faker.random.objectElement(ScrapperDialogBehaviour);

  const cases = {
    [fieldNameCreator('newRunSettings.dialogBehaviour')]: {
      handler: selectHandler(dialogBehaviour),
    },
    [fieldNameCreator('newRunSettings.noElementsFoundBehavior')]: {
      handler: selectHandler(noElementsFoundBehaviour),
    },
    ...commonFields.keyHandler,
  };

  if (dialogBehaviour === ScrapperDialogBehaviour.AlwaysConfirm) {
    cases[fieldNameCreator('newRunSettings.promptText')] = {
      handler: blockEditorHandler(faker.lorem.sentence()),
    };
  }

  return cases;
};
