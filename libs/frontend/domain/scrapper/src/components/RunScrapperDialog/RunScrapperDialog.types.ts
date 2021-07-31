import { BaseDialogProps } from '@scrapper-gate/frontend/dialogs';
import { RunStateProps } from '@scrapper-gate/frontend/ui';
import {
  Scrapper,
  ScrapperRun,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';

export interface ScrapperForRun
  extends Pick<Scrapper, 'id' | 'isRunning' | 'name' | 'type'> {
  steps?: Pick<ScrapperStep, 'id'>[];
  lastRun?: Pick<ScrapperRun, 'id' | 'endedAt' | 'state'>;
}

export interface RunScrapperDialogProps
  extends BaseDialogProps,
    Pick<RunStateProps, 'runUrlCreator'> {
  scrapper?: ScrapperForRun;
  onRun?: () => unknown;
}
