import { NodePosition } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../BaseSchema';

export class PositionDto
  extends BaseSchema<NodePosition>
  implements NodePosition {
  @(jf.number().required())
  x: number;

  @(jf.number().required())
  y: number;
}
