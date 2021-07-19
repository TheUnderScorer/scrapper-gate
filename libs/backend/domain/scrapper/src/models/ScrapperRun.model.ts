import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import {
  RunnerError,
  RunState,
  ScrapperRun,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ScrapperModel } from './Scrapper.model';
import { ScrapperRunStepResultModel } from './ScrapperRunStepResult.model';

@Entity(Entities.ScrapperRun)
export class ScrapperRunModel
  extends BaseModel<ScrapperRun>
  implements ScrapperRun
{
  @Column({
    type: 'enum',
    enum: RunState,
  })
  state: RunState;

  @Column({
    type: 'jsonb',
  })
  steps: ScrapperStep[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  error?: RunnerError;

  @Column({
    nullable: true,
  })
  endedAt?: Date;

  @Column({
    nullable: true,
  })
  startedAt?: Date;

  @Column({
    nullable: true,
    type: 'float',
  })
  progress?: number;

  @Column({
    nullable: true,
  })
  key?: string;

  @OneToMany(() => ScrapperRunStepResultModel, (model) => model.scrapperRun, {
    cascade: true,
  })
  results: ScrapperRunStepResultModel[];

  @ManyToOne(() => ScrapperModel, (model) => model.runs)
  scrapper: ScrapperModel;
}
