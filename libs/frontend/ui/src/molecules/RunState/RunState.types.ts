import { RunState } from '@scrapper-gate/shared/schema';

export interface RunStateProps {
  state: RunState;
  entity: string;
  called?: boolean;
  name: string;
  lastRunDate?: Date;
  runMutationLoading?: boolean;
}
