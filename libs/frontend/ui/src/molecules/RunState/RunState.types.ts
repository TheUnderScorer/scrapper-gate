import { RunResultRouteParams } from '@scrapper-gate/shared/routing';
import { RunState } from '@scrapper-gate/shared/schema';
import { MouseEventHandler } from 'react';

export interface RunStateProps {
  state: RunState;
  entity: string;
  called?: boolean;
  name: string;
  lastRunDate?: Date;
  runMutationLoading?: boolean;
  runUrlCreator?: (params?: RunResultRouteParams) => string;
  runId?: string;
  onRunUrlClick?: MouseEventHandler;
}
