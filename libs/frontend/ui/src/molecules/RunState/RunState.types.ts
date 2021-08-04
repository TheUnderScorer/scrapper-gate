import {
  RouteCreator,
  RunResultRouteParams,
} from '@scrapper-gate/shared/routing';
import { RunState } from '@scrapper-gate/shared/schema';
import { MouseEventHandler } from 'react';

export enum RunStateEntity {
  Scrapper = 'scrapper',
}

export interface RunStateProps {
  state?: RunState;
  entity: RunStateEntity;
  runMutationCalled?: boolean;
  entityName: string;
  lastRunDate?: Date;
  runMutationLoading?: boolean;
  runUrlCreator?: RouteCreator<RunResultRouteParams>;
  runId?: string;
  onRunUrlClick?: MouseEventHandler;
  showIcon?: boolean;
}
