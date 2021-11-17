import { ElementHandle, Page } from 'playwright';
import { dragElementBy, DragXY } from '../../utils/drag';
import { repeatUntil } from '../../utils/repeatUntil';

type By = 'id' | 'key' | 'index';

export class FlowBuilderPage {
  private static selectors = {
    canvas: '.flow-builder-canvas',
    selection: (label: string) =>
      `.flow-builder-selection-list :text("${label}")`,
    selectionFromContextMenu: (label: string) =>
      `.context-menu :text("${label}")`,
    node: (value: string | number, by: By) => {
      switch (by) {
        case 'id':
          return `.flow-builder-node[data-id="${value}"]`;

        case 'index':
          return `.flow-builder-node[data-index="${value}"]`;

        default:
          return `.flow-builder-node[data-key="${value}"]`;
      }
    },
    submit: '.flow-builder-submit-btn',
  };

  constructor(protected readonly page: Page) {}

  async addNodeViaContextMenu(label: string) {
    const canvas = await this.getCanvas();

    await canvas.dispatchEvent('contextmenu', {
      which: 3,
    });

    await this.page.click(
      FlowBuilderPage.selectors.selectionFromContextMenu(label)
    );

    return this.getRecentlyCreatedNode();
  }

  async submit() {
    const submitButton = await this.page.waitForSelector(
      FlowBuilderPage.selectors.submit
    );

    await submitButton.click();

    await repeatUntil(
      async () => {
        const text = await submitButton.textContent();

        return text === 'Save';
      },
      {
        conditionChecker: Boolean,
      }
    );
  }

  async dragSelectionIntoCanvas(selectionLabel: string) {
    await this.page.dragAndDrop(
      FlowBuilderPage.selectors.selection(selectionLabel),
      FlowBuilderPage.selectors.canvas,
      {
        force: true,
      }
    );

    return this.getRecentlyCreatedNode();
  }

  private async getRecentlyCreatedNode() {
    const node = await this.page.waitForSelector(
      '.flow-builder-node.was-recently-created'
    );

    const id = await node.getAttribute('data-id');

    if (!id) {
      throw new Error('Unable to determine id of created node.');
    }

    return {
      id,
      node,
    };
  }

  async openNode(value: string | number, by: By = 'id') {
    const selector = FlowBuilderPage.selectors.node(value, by);

    await this.page.dblclick(selector);
  }

  async closeCurrentNode() {
    await this.page.click('.close-node');
  }

  async assertEdgesCount(expected: number) {
    const edges = await this.page.$$('.react-flow__edge');

    expect(edges).toHaveLength(expected);
  }

  async dragCanvasBy(by: DragXY) {
    const pane = await this.getPane();

    await dragElementBy(this.page, pane, by);
  }

  async getNode(value: string, by: By = 'id') {
    return this.page.waitForSelector(FlowBuilderPage.selectors.node(value, by));
  }

  async getNodeIndex(value: string | ElementHandle, by: By = 'id') {
    const node =
      typeof value === 'string' ? await this.getNode(value, by) : value;

    const index = Number(await node.getAttribute('data-index'));

    if (Number.isNaN(index)) {
      throw new Error('Unable to determine node index.');
    }

    return index;
  }

  async connectNodes(sourceNodeId: string, targetNodeId: string) {
    const { mouse } = this.page;

    const sourceHandle = await this.page.waitForSelector(
      `${FlowBuilderPage.selectors.node(sourceNodeId, 'id')} .source`
    );
    const sourceBox = await FlowBuilderPage.getNodeHandleBox(sourceHandle);

    const targetHandle = await this.page.waitForSelector(
      `${FlowBuilderPage.selectors.node(targetNodeId, 'id')} .target`
    );
    const targetBox = await FlowBuilderPage.getNodeHandleBox(targetHandle);

    if (!targetBox || !sourceBox) {
      throw new Error(
        'Unable to determine source or target node bounding box.'
      );
    }

    await mouse.move(sourceBox.x, sourceBox.y);

    await mouse.down({
      button: 'left',
    });

    await mouse.move(targetBox.x, targetBox.y);

    await mouse.up({
      button: 'left',
    });
  }

  private async getPane() {
    return this.page.waitForSelector('.react-flow__pane');
  }

  private async getCanvas() {
    return this.page.waitForSelector(FlowBuilderPage.selectors.canvas);
  }

  private static getNodeHandleBox(
    handle: ElementHandle<HTMLElement | SVGElement>
  ) {
    return handle.evaluate((element) => {
      const rect = element.getBoundingClientRect();

      const halfWidth = rect.width / 2;

      return {
        y: rect.y,
        x: rect.x + halfWidth,
      };
    });
  }
}
