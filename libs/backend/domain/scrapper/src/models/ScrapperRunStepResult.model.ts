import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import {
  ErrorObject,
  RunnerPerformanceEntry,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ScrapperRunModel } from './ScrapperRun.model';
import { ScrapperRunStepValueModel } from './ScrapperRunStepValue.model';

@Entity(Entities.ScrapperRunStepResult)
export class ScrapperRunStepResultModel
  extends BaseModel<ScrapperRunStepResult>
  implements ScrapperRunStepResult {
  @Column({
    type: 'jsonb',
  })
  step: ScrapperStep;

  @OneToMany(() => ScrapperRunStepValueModel, (model) => model.result, {
    cascade: true,
  })
  values?: ScrapperRunStepValueModel[];

  @Column({
    type: 'jsonb',
  })
  performance: RunnerPerformanceEntry;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  error?: ErrorObject;

  @ManyToOne(() => ScrapperRunModel, (model) => model.results)
  scrapperRun: ScrapperRunModel;
}
