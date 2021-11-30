/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { scrapperActionTextMap } from '@scrapper-gate/frontend/domain/scrapper';
import { last, wait } from '@scrapper-gate/shared/common';
import { ScrapperAction, Variable } from '@scrapper-gate/shared/schema';
import { FieldsHandler } from '../fields/FieldsHandler';
import { selectHandler } from '../fields/handlers/selectHandler';
import { textFieldHandler } from '../fields/handlers/textFieldHandler';
import { FlowBuilderPage } from './base/FlowBuilderPage';

export class ScrapperBuilderPage extends FlowBuilderPage {
  async setName(name: string) {
    await this.page.click('.form-editable-text');
    await this.page.fill('.form-editable-text-field input', name);
    await this.page.click('.form-editable-text-confirm');
  }

  async addVariable(variable: Variable) {
    await this.switchToTab('variables');

    await this.page.click('.add-variable');

    await wait(100);

    const variableRow = last(await this.page.$$('.variable-row'));
    const index = Number(await variableRow.getAttribute('data-index'));

    const fieldsHandler = new FieldsHandler(
      {
        [`variables[${index}].key`]: {
          handler: textFieldHandler(variable.key!),
        },
        [`variables[${index}].value`]: {
          handler: textFieldHandler(variable.value),
        },
        [`variables[${index}].defaultValue`]: {
          handler: textFieldHandler(variable.defaultValue),
        },
        [`variables[${index}].type`]: {
          handler: selectHandler(variable.type!),
        },
      },
      this.page
    );

    await fieldsHandler.fillAll();

    return {
      fieldsHandler,
      index,
    };
  }

  async getFormState() {
    await this.page.evaluate(() => {
      const root = document.querySelector('#scrapper_gate_content_root');
      const shadowOwner = root?.children?.[0];
      const shadow = shadowOwner?.shadowRoot;

      const trigger =
        shadow?.querySelector<HTMLButtonElement>('.expose-form-state');

      if (!trigger) {
        throw new Error('No expose state trigger found');
      }

      trigger?.click();
    });

    const form = await this.page.waitForSelector('.scrapper-builder-form');

    const formState = await form.getAttribute('data-form-state');

    if (!formState) {
      throw new Error('Form state is not available');
    }

    return JSON.parse(formState);
  }

  async getName() {
    return this.page.$('.form-editable-text').then((el) => el?.textContent());
  }

  async dragStepIntoCanvas(action: ScrapperAction) {
    const label = scrapperActionTextMap[action];

    return this.dragSelectionIntoCanvas(label);
  }

  async addStepViaContextMenu(action: ScrapperAction) {
    const label = scrapperActionTextMap[action];

    return this.addNodeViaContextMenu(label);
  }
}
