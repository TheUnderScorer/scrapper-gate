import { BaseDialogProps } from '@scrapper-gate/frontend/dialogs';
import {
  Scrapper,
  ScrapperRun,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';

export interface ScrapperForRun
  extends Pick<Scrapper, 'id' | 'isRunning' | 'name' | 'type' | 'state'> {
  steps?: Pick<ScrapperStep, 'id'>[];
  lastRun?: Pick<ScrapperRun, 'id' | 'endedAt'>;
}

export interface RunScrapperDialogProps extends BaseDialogProps {
  scrapper?: ScrapperForRun;
  onRun?: () => unknown;
}
