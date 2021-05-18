import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import {
  ScrapperRunValue,
  ScrapperRunValueElement,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, ManyToOne } from 'typeorm';
import { ScrapperRunStepResultModel } from './ScrapperRunStepResult.model';

@Entity(Entities.ScrapperRunStepValue)
export class ScrapperRunStepValueModel
  extends BaseModel<ScrapperRunValue>
  implements ScrapperRunValue {
  @Column()
  value: string;

  @Column({
    type: 'jsonb',
  })
  sourceElement?: ScrapperRunValueElement;

  @ManyToOne(() => ScrapperRunStepResultModel, (model) => model.values)
  result: ScrapperRunStepResultModel;
}
