import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import {
  ErrorObject,
  RunState,
  ScrapperRun,
  ScrapperRunStepResult,
  ScrapperStep,
} from '@scrapper-gate/shared/schema';
import { Column, Entity } from 'typeorm';

@Entity(Entities.ScrapperRun)
export class ScrapperRunModel
  extends BaseModel<ScrapperRun>
  implements ScrapperRun {
  results: ScrapperRunStepResult[];

  @Column()
  state: RunState;

  @Column({
    type: 'jsonb',
  })
  steps: ScrapperStep[];

  @Column({
    type: 'jsonb',
  })
  error?: ErrorObject;

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
}
