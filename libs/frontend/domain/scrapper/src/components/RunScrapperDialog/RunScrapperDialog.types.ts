import { BaseDialogProps } from '@scrapper-gate/frontend/dialogs';
import { RunStateProps } from '@scrapper-gate/frontend/ui';
import { ScrapperForRunFragment } from '@scrapper-gate/shared/schema';

export interface RunScrapperDialogProps
  extends BaseDialogProps,
    Pick<RunStateProps, 'runUrlCreator'> {
  scrapper?: ScrapperForRunFragment;
  onRun?: () => unknown;
}
