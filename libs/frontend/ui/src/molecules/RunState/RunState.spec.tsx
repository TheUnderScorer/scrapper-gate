import { RunState } from './RunState';
import { render } from '@testing-library/react';
import { RunStateProps } from './RunState.types';
import { RunState as RunStateEnum } from '@scrapper-gate/shared/schema';

type TestCaseData = [props: RunStateProps, expectedContent: string];

const baseProps = {
  name: 'Test',
  entity: 'scrapper',
};

describe('<RunState />', () => {
  it.each<TestCaseData>([
    [
      {
        ...baseProps,
        state: RunStateEnum.Pending,
      },
      'Your scrapper is currently in queue...',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Completed,
      },
      'You are about to run scrapper',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Completed,
        called: true,
      },
      'Your scrapper run has completed',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Completed,
        runMutationLoading: true,
        called: true,
      },
      'You are about to run scrapper',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Failed,
        called: true,
      },
      'Your run has failed',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Cancelled,
        called: true,
      },
      'Your run was cancelled',
    ],
  ])(
    'should show correct message depending on state',
    (props, expectedContent) => {
      const cmp = render(<RunState {...props} />);

      expect(
        cmp.container.querySelector('.run-state-container')
      ).toHaveTextContent(new RegExp(expectedContent));
    }
  );
});
