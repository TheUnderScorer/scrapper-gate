import { NodePosition } from '@scrapper-gate/shared/schema';
import joi from 'joi';

export const PositionInputSchema = joi.object<NodePosition>({
  x: joi.number().required(),
  y: joi.number().required(),
});
