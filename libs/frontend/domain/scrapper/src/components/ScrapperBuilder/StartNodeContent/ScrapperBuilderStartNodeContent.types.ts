import { NodeContentProps } from '@scrapper-gate/frontend/flow-builder';
import { ScrapperBuilderProps } from '../ScrapperBuilder.types';

export interface ScrapperBuilderStartNodeContentProps
  extends NodeContentProps,
    Pick<ScrapperBuilderProps, 'browserUrl'> {}
