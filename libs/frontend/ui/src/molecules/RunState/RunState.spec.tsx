import { RunState as RunStateEnum } from '@scrapper-gate/shared/schema';
import { render } from '@testing-library/react';
import { RunState } from './RunState';
import { RunStateEntity, RunStateProps } from './RunState.types';

type TestCaseData = [props: RunStateProps, expectedContent: string];

const baseProps = {
  name: 'Test',
  entity: RunStateEntity.Scrapper,
  showIcon: true,
  entityName: '',
};

describe('<RunState />', () => {
  it.each<TestCaseData>([
    [
      {
        ...baseProps,
        state: RunStateEnum.Pending,
      },
      'Your scrapper is currently in queue.',
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
        runMutationCalled: true,
      },
      'Your scrapper run has completed',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Completed,
        runMutationLoading: true,
        runMutationCalled: true,
      },
      'You are about to run scrapper',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Failed,
        runMutationCalled: true,
      },
      'Your run has failed',
    ],
    [
      {
        ...baseProps,
        state: RunStateEnum.Cancelled,
        runMutationCalled: true,
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
