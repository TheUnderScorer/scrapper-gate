import { BaseModel } from '@scrapper-gate/backend/base-model';
import { FileModel } from '@scrapper-gate/backend/domain/files';
import { Entities } from '@scrapper-gate/shared/common';
import {
  ScrapperRunValue,
  ScrapperRunValueElement,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ScrapperRunStepResultModel } from './ScrapperRunStepResult.model';

@Entity(Entities.ScrapperRunStepValue)
export class ScrapperRunStepValueModel
  extends BaseModel<ScrapperRunValue>
  implements ScrapperRunValue
{
  @Column({
    nullable: true,
  })
  value?: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  sourceElement?: ScrapperRunValueElement;

  @ManyToOne(() => ScrapperRunStepResultModel, (model) => model.values)
  result: ScrapperRunStepResultModel;

  @ManyToOne(() => FileModel)
  @JoinColumn()
  screenshot: FileModel;
}
