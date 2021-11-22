import { VariableConditionalRule } from '@scrapper-gate/shared/schema';
import { ConditionalRuleDto } from './ConditionalRuleDto';
import * as jf from 'joiful';

export class VariableConditionalRuleDto
  extends ConditionalRuleDto
  implements VariableConditionalRule
{
  @(jf.string().required())
  variableKey: string;

  @jf.any()
  expectedValue?: unknown;
}
