import { wait } from '@scrapper-gate/shared/common';
import { ElementHandle } from 'playwright';
import { clearFocusedFieldWithKeyboard } from '../../utils/clearFocusedFieldWithKeyboard';
import { repeatUntil } from '../../utils/repeatUntil';
import { FieldHandler } from '../fields.types';

const getEditor = async (element: ElementHandle<HTMLIFrameElement>) => {
  await repeatUntil(() => element.getAttribute('class'), {
    conditionChecker: (className) => Boolean(className?.includes('loaded')),
  });

  await element.focus();

  const frame = await element.contentFrame();

  if (!frame) {
    throw new Error('Could not find iframe');
  }

  const editor = await frame.waitForSelector('.monaco-editor');

  await editor.click();

  return {
    editor,
    textArea: await editor.waitForSelector('textarea'),
    framePage: frame.page(),
  };
};

export const iframeCodeEditorHandler = (
  value: string
): FieldHandler<HTMLIFrameElement, string> => ({
  providedValue: value,
  fill: async (element, page) => {
    const { framePage } = await getEditor(element);

    await clearFocusedFieldWithKeyboard(framePage);

    await page.keyboard.type(value);

    await wait(1000);
  },
  getInputValue: async (element) => {
    const { editor, textArea, framePage } = await getEditor(element);

    await editor.focus();

    await framePage.keyboard.press('Control+A');

    return textArea.inputValue();
  },
});
