import { scrapperActionTextMap } from '@scrapper-gate/frontend/domain/scrapper';
import { ScrapperAction } from '@scrapper-gate/shared/schema';
import { FlowBuilderPage } from './base/FlowBuilderPage';

export class ScrapperBuilderPage extends FlowBuilderPage {
  async setName(name: string) {
    await this.page.click('.form-editable-text');
    await this.page.fill('.form-editable-text-field input', name);
    await this.page.click('.form-editable-text-confirm');
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
