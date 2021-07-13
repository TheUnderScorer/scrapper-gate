import { BaseDialogProps } from '@scrapper-gate/frontend/dialogs';
import { Scrapper, ScrapperStep } from '@scrapper-gate/shared/schema';

export interface ScrapperForRun
  extends Pick<Scrapper, 'id' | 'isRunning' | 'name' | 'type'> {
  steps: Pick<ScrapperStep, 'id'>[];
}

export interface RunScrapperDialogProps extends BaseDialogProps {
  scrapper: ScrapperForRun;
}
