import { RunStateProps } from '../RunState.types';

export type RunStateIconProps = Pick<
  RunStateProps,
  'state' | 'runMutationCalled' | 'runMutationLoading' | 'entity'
> & {
  className?: string;
  showTooltip?: boolean;
};
