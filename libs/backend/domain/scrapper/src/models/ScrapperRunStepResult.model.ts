import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import { pickIdsFromNodeLike } from '@scrapper-gate/shared/node';
import {
  ErrorObject,
  RunnerPerformanceEntry,
  RunState,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ScrapperRunModel } from './ScrapperRun.model';
import { ScrapperRunStepValueModel } from './ScrapperRunStepValue.model';

@Entity(Entities.ScrapperRunStepResult)
export class ScrapperRunStepResultModel
  extends BaseModel<ScrapperRunStepResult>
  implements ScrapperRunStepResult
{
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
    nullable: true,
  })
  performance?: RunnerPerformanceEntry;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  error?: ErrorObject;

  @Column({
    type: 'enum',
    enum: RunState,
  })
  state: RunState;

  @ManyToOne(() => ScrapperRunModel, (model) => model.results)
  scrapperRun: ScrapperRunModel;

  @Column({
    nullable: true,
  })
  endedAt?: Date;

  @Column({
    nullable: true,
  })
  startedAt?: Date;

  static createPendingFromStep(step: ScrapperStep) {
    return this.create({
      step: {
        ...step,
        ...pickIdsFromNodeLike(step),
      },
      state: RunState.Pending,
    });
  }
}
