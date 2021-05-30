import { VariableScope } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { VariableInputDto } from '../variables/VariableInputDto';

export class ScrapperVariableDto extends VariableInputDto {
  @(jf.string().valid(VariableScope.Scrapper).required())
  scope: VariableScope;
}
