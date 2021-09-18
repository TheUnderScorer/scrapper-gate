import { ThemedSxProps } from '@scrapper-gate/frontend/theme';
import { RunStateProps } from '../RunState.types';

export interface RunStateIconProps
  extends Pick<
      RunStateProps,
      'state' | 'runMutationCalled' | 'runMutationLoading' | 'entity'
    >,
    ThemedSxProps {
  className?: string;
  showTooltip?: boolean;
}
