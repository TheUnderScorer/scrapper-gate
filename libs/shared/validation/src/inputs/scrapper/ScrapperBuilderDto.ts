import { ScrapperInput, VariableInput } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../../BaseSchema';
import { ScrapperStepNodeDto } from './ScrapperStepNodeDto';
import { ScrapperVariableDto } from './ScrapperVariableDto';

export class ScrapperBuilderDto
  extends BaseSchema<ScrapperBuilderDto>
  implements Pick<ScrapperInput, 'variables' | 'name'> {
  @jf.array({ elementClass: ScrapperStepNodeDto })
  items: ScrapperStepNodeDto[];

  @jf.string()
  name?: string;

  @jf.array({ elementClass: ScrapperVariableDto })
  variables?: VariableInput[];
}
