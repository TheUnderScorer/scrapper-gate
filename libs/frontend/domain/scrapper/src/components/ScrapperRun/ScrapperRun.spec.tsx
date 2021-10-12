/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { QueryParamProvider } from '@scrapper-gate/frontend/common';
import { GetMyScrapperRunDocument } from '@scrapper-gate/frontend/schema';
import { SnackbarProvider } from '@scrapper-gate/frontend/snackbars';
import { ThemeProvider } from '@scrapper-gate/frontend/theme';
import {
  createMockScrapper,
  createMockScrapperRun,
  createMockScrapperStep,
} from '@scrapper-gate/shared/domain/scrapper/mocks';
import {
  GetMyScrapperRunQueryVariables,
  RunState,
  ScrapperAction,
  ScrapperRun as Run,
} from '@scrapper-gate/shared/schema';
import '@testing-library/jest-dom';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { XYPosition } from 'react-flow-renderer';
import { BrowserRouter } from 'react-router-dom';
import { ScrapperRun } from './ScrapperRun';

async function createRun() {
  const scrapper = createMockScrapper();

  const basePosition: XYPosition = {
    x: 50,
    y: 0,
  };

  const steps = await Promise.all([
    createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.Click;
        step.isFirst = true;

        return step;
      },
    }),

    createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.ReadText;

        return step;
      },
    }),

    createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.Condition;

        return step;
      },
    }),

    createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.Type;

        return step;
      },
    }),

    createMockScrapperStep({
      intercept: (step) => {
        step.action = ScrapperAction.ReloadPage;

        return step;
      },
    }),
  ]);

  steps[0].nextStep = steps[1];
  steps[1].nextStep = steps[2];
  steps[2].stepOnTrue = steps[3];
  steps[2].stepOnFalse = steps[4];

  steps.forEach((step, index) => {
    step.position = {
      ...basePosition,
      x: basePosition.x * index,
    };
  });

  const run = createMockScrapperRun(steps);

  run.scrapper = scrapper;
  run.state = RunState.Pending;

  return run;
}

let mocks: MockedResponse[];
let run: Run;

async function renderCmp() {
  let cmp: RenderResult;

  act(() => {
    cmp = render(
      <BrowserRouter>
        <QueryParamProvider>
          <SnackbarProvider>
            <ThemeProvider>
              <MockedProvider mocks={mocks}>
                <ScrapperRun
                  runId={run.id}
                  scrapperUrlCreator={jest.fn()}
                  fetchPolicy="no-cache"
                />
              </MockedProvider>
            </ThemeProvider>
          </SnackbarProvider>
        </QueryParamProvider>
      </BrowserRouter>
    );
  });

  return cmp!;
}

async function waitForNodes(cmp: RenderResult) {
  await waitFor(() => {
    const nodes = cmp.container.querySelectorAll('.flow-builder-node');

    // All steps + start node
    expect(nodes).toHaveLength(run.steps!.length + 1);
  });
}

describe('<ScrapperRun />', () => {
  beforeEach(async () => {
    run = await createRun();

    mocks = [
      {
        request: {
          query: GetMyScrapperRunDocument,
          variables: {
            id: run.id,
          } as GetMyScrapperRunQueryVariables,
        },
        result: {
          data: {
            getMyScrapperRun: run,
          },
        },
      },
    ];
  });

  it('should render without crashing', async () => {
    const cmp = await renderCmp();

    expect(cmp).toMatchSnapshot();
  });

  it('should render steps correctly', async () => {
    const cmp = await renderCmp();

    await waitForNodes(cmp);
  });

  it('should indicate if step is running', async () => {
    run.results![0].state = RunState.InProgress;

    const cmp = await renderCmp();

    await waitForNodes(cmp);

    const element = cmp.container.querySelector(
      `#node-${run.results![0].step.id} .scrapper-run-state`
    );

    expect(element).toBeInTheDocument();
  });

  it('should render run data', async () => {
    const result = run.results![1];

    const cmp = await renderCmp();

    await waitForNodes(cmp);

    const target = cmp.container.querySelector(
      `#node-${result.step.id} .action-node-box`
    );

    act(() => {
      userEvent.dblClick(target!);
    });

    const content = await cmp.container.querySelector(
      '.scrapper-run-node-content'
    );

    expect(content).toBeInTheDocument();
  });
});
