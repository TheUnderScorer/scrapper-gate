/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { Box } from '@material-ui/core';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import {
  FlowBuilderItem,
  FlowBuilderNodeTypes,
  flowBuilderUtils,
} from '@scrapper-gate/frontend/flow-builder';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import { getById, last, wait } from '@scrapper-gate/shared/common';
import { pickScrapperInput } from '@scrapper-gate/shared/domain/scrapper';
import {
  createMockScrapper,
  createMockScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper/mocks';
import { Scrapper, ScrapperAction } from '@scrapper-gate/shared/schema';
import { act, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { isEdge, isNode, Node, XYPosition } from 'react-flow-renderer';
import { MemoryRouter } from 'react-router';
import { ScrapperBuilder } from './ScrapperBuilder';
import {
  ScrapperBuilderNodeProperties,
  ScrapperBuilderProps,
} from './ScrapperBuilder.types';

jest.mock('@scrapper-gate/frontend/schema', () => {
  const mock = jest.fn();

  const actual = jest.requireActual('@scrapper-gate/frontend/schema');

  return {
    ...actual,
    useUpdateScrapperMutation: () => [mock, { data: null }],
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
              <Box width="600px" height="600px">
                <ScrapperBuilder
                  ElementPicker={jest.fn()}
                  browserUrl="http://example.org"
                  {...props}
                />
              </Box>
            </SnackbarProvider>
          </QueryParamProvider>
        </MemoryRouter>
      </ThemeProvider>
    </MockedProvider>
  );

const setupScrapperSteps = async () => {
  const basePosition: XYPosition = {
    x: 50,
    y: 0,
  };

  scrapper.steps = await Promise.all([
    createMockScrapperStep({
      disabledActions: [ScrapperAction.Condition],
      createdBy: scrapper.createdBy,
      intercept: (step) => {
        step.isFirst = true;

        return step;
      },
    }),

    createMockScrapperStep({
      disabledActions: [ScrapperAction.Condition],
      createdBy: scrapper.createdBy,
    }),

    createMockScrapperStep({
      disabledActions: [ScrapperAction.Condition],
      createdBy: scrapper.createdBy,
    }),

    createMockScrapperStep({
      disabledActions: [ScrapperAction.Condition],
      createdBy: scrapper.createdBy,
    }),
  ]);

  scrapper.steps[0].nextStep = scrapper.steps[1];
  scrapper.steps[1].previousSteps = [scrapper.steps[0]];

  scrapper.steps[1].nextStep = scrapper.steps[2];
  scrapper.steps[2].previousSteps = [scrapper.steps[1]];

  scrapper.steps[2].nextStep = scrapper.steps[3];
  scrapper.steps[3].previousSteps = [scrapper.steps[2]];

  scrapper.steps.forEach((step, index) => {
    step.position = {
      ...basePosition,
      x: basePosition.x * index,
    };
  });
};

describe('ScrapperBuilder', () => {
  beforeEach(() => {
    scrapper = createMockScrapper();
  });

  it('should render without crashing', () => {
    const cmp = renderCmp();

    expect(cmp).toMatchSnapshot();
  });

  it('should support persisted start node position', async () => {
    await setupScrapperSteps();

    const onChange = jest.fn();

    scrapper.startNodePosition = {
      x: 50,
      y: 236,
    };

    renderCmp({
      initialScrapper: scrapper,
      loading: false,
      onChange,
    });

    await act(async () => {
      await wait(1000);
    });

    await waitFor(
      () => {
        const items = last(
          onChange.mock.calls
        )[0] as FlowBuilderItem<ScrapperBuilderNodeProperties>[];

        const startNode = items.find(
          (item) => item.type === FlowBuilderNodeTypes.Start
        ) as Node;

        expect(startNode.position).toEqual(scrapper.startNodePosition);
      },
      {
        interval: 250,
        timeout: 7000,
      }
    );
  });

  it('should correctly render scrapper steps', async () => {
    await setupScrapperSteps();

    const onChange = jest.fn();

    renderCmp({
      initialScrapper: scrapper,
      loading: false,
      onChange,
    });

    await act(async () => {
      await wait(1000);
    });

    let items: FlowBuilderItem<ScrapperBuilderNodeProperties>[] = [];

    await waitFor(
      () => {
        const call = last(onChange.mock.calls)[0];

        expect(call).toBeDefined();

        items = call;

        expect(items).toHaveLength(scrapper.steps!.length * 2 + 1);
      },
      {
        interval: 250,
        timeout: 7000,
      }
    );

    const edgesMap = [
      ['start', scrapper.steps![0].id],
      [scrapper.steps![0].id, scrapper.steps![1].id],
      [scrapper.steps![1].id, scrapper.steps![2].id],
      [scrapper.steps![2].id, scrapper.steps![3].id],
    ];

    edgesMap.forEach(([source, target]) => {
      const edge = getById(
        items,
        flowBuilderUtils.generateEdgeId(source, target)
      );

      expect(edge).toBeDefined();
      expect(isEdge(edge!)).toEqual(true);
    });

    scrapper.steps!.forEach((step) => {
      const node = getById(items, step.id) as Node;

      expect(isNode(node)).toEqual(true);
      expect(node.position).toEqual(step.position);
    });
  }, 100000);

  it('should persist scrapper', async () => {
    await setupScrapperSteps();

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
      userEvent.click(submitBtn!);
    });

    await act(async () => {
      await wait(450);
    });

    expect(mockFn).toHaveBeenCalledTimes(1);

    const { variables } = mockFn.mock.calls[0][0];

    expect(variables.input.startNodePosition).toEqual({
      x: -180,
      y: 0,
    });

    scrapper
      .steps!.map((step) => pickScrapperInput(step))
      .forEach((stepInput) => {
        const stepVariable = getById(variables.input.steps, stepInput.id);
        const step = getById(scrapper.steps!, stepInput.id);

        expect(stepVariable).toEqual({
          ...stepInput,
          isFirst: Boolean(step?.isFirst),
          nextStepId: step!.nextStep?.id,
        });
      });
  });
});
