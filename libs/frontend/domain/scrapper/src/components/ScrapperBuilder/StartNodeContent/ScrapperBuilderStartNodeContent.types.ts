import { NodeContentProps } from '@scrapper-gate/frontend/ui';
import { ScrapperBuilderProps } from '../ScrapperBuilder.types';

export interface ScrapperBuilderStartNodeContentProps
  extends NodeContentProps,
    Pick<ScrapperBuilderProps, 'browserUrl'> {}
