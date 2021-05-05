import { act, render } from '@testing-library/react';
import {
  ScrapperBuilder,
  ScrapperBuilderProps,
} from '@scrapper-gate/frontend/domain/scrapper';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { MemoryRouter } from 'react-router';
import {
  createMockScrapper,
  createMockScrapperStep,
  pickScrapperInput,
} from '@scrapper-gate/shared/domain/scrapper';
import { Scrapper } from '@scrapper-gate/shared/schema';
import { getById, wait } from '@scrapper-gate/shared/common';
import {
  flowBuilderTestUtils,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/ui';
import { isEdge, isNode, Node } from 'react-flow-renderer';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';

jest.mock('@scrapper-gate/frontend/schema', () => {
  const mock = jest.fn();

  return {
    useUpdateScrapperMutation: () => [mock],
  };
});

const defaultMocks: MockedResponse[] = [];

let scrapper: Scrapper;

const renderCmp = (
  props: Partial<ScrapperBuilderProps> = {},
  mocks = defaultMocks
) =>
  render(
    <MockedProvider mocks={mocks}>
      <ThemeProvider>
        <MemoryRouter>
          <QueryParamProvider>
            <SnackbarProvider>
              <ScrapperBuilder
                ElementPicker={jest.fn()}
                browserUrl="http://example.org"
                renderItemsInDataAttribute
                {...props}
              />
            </SnackbarProvider>
          </QueryParamProvider>
        </MemoryRouter>
      </ThemeProvider>
    </MockedProvider>
  );

const setupScrapperSteps = () => {
  scrapper.steps = [
    createMockScrapperStep(scrapper.createdBy),
    createMockScrapperStep(scrapper.createdBy),
    createMockScrapperStep(scrapper.createdBy),
    createMockScrapperStep(scrapper.createdBy),
  ];

  scrapper.steps[0].nextStep = scrapper.steps[1];
  scrapper.steps[1].previousSteps = [scrapper.steps[0]];

  scrapper.steps[1].nextStep = scrapper.steps[2];
  scrapper.steps[2].previousSteps = [scrapper.steps[1]];

  scrapper.steps[2].nextStep = scrapper.steps[3];
  scrapper.steps[3].previousSteps = [scrapper.steps[2]];
};

describe('ScrapperBuilder', () => {
  beforeEach(() => {
    scrapper = createMockScrapper();
  });

  it('should render without crashing', () => {
    const cmp = renderCmp();

    expect(cmp).toMatchSnapshot();
  });

  it('should correctly render scrapper steps', async () => {
    setupScrapperSteps();

    const cmp = renderCmp({
      initialScrapper: scrapper,
      loading: false,
    });

    await act(async () => {
      await wait(1000);
    });

    const items = flowBuilderTestUtils.getItems(cmp.container);

    // All steps + start node + edges
    expect(items).toHaveLength(8);

    const edgesMap = [
      ['start', scrapper.steps[0].id],
      [scrapper.steps[0].id, scrapper.steps[1].id],
      [scrapper.steps[1].id, scrapper.steps[2].id],
    ];

    edgesMap.forEach(([source, target]) => {
      const edge = getById(
        items,
        flowBuilderUtils.generateEdgeId(source, target)
      );

      expect(edge).toBeDefined();
      expect(isEdge(edge)).toEqual(true);
    });

    scrapper.steps.forEach((step) => {
      const node = getById(items, step.id) as Node;

      expect(isNode(node)).toEqual(true);
      expect(node.position).toEqual(step.position);
    });
  }, 100000);

  it('should persist scrapper', async () => {
    setupScrapperSteps();

    const cmp = renderCmp({
      initialScrapper: scrapper,
      loading: false,
    });

    const [mockFn] = jest
      .requireMock('@scrapper-gate/frontend/schema')
      .useUpdateScrapperMutation() as [jest.Mock];

    await act(async () => {
      await wait(1000);
    });

    const submitBtn = cmp.container.querySelector('.flow-builder-submit-btn');

    act(() => {
      userEvent.click(submitBtn);
    });

    await act(async () => {
      await wait(450);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    const { variables } = mockFn.mock.calls[0][0];

    scrapper.steps
      .map((step) => pickScrapperInput(step))
      .forEach((stepInput) => {
        const stepVariable = getById(variables.input.steps, stepInput.id);
        const step = getById(scrapper.steps, stepInput.id);

        expect(stepVariable).toEqual({
          ...stepInput,
          nextStepId: step.nextStep?.id,
        });
      });
  }, 999999999);
});
