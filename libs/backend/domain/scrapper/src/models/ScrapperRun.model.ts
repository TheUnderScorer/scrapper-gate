import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Entities } from '@scrapper-gate/shared/common';
import { defaultScrapperRunSettings } from '@scrapper-gate/shared/domain/scrapper';
import { isRunning } from '@scrapper-gate/shared/run-states';
import {
  Maybe,
  RunnerError,
  RunState,
  ScrapperRun,
  ScrapperRunSettings,
  ScrapperStep,
  Variable,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
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
  error?: Maybe<RunnerError>;

  @Column({
    nullable: true,
  })
  endedAt?: Maybe<Date>;

  @Column({
    nullable: true,
  })
  startedAt?: Maybe<Date>;

  @Column({
    nullable: true,
    type: 'float',
  })
  progress?: Maybe<number>;

  @Column({
    nullable: true,
  })
  key?: Maybe<string>;

  @OneToMany(() => ScrapperRunStepResultModel, (model) => model.scrapperRun, {
    cascade: true,
  })
  results?: Maybe<ScrapperRunStepResultModel[]>;

  @ManyToOne(() => ScrapperModel, (model) => model.runs)
  scrapper?: Maybe<ScrapperModel>;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: defaultScrapperRunSettings,
  })
  runSettings?: Maybe<ScrapperRunSettings>;

  @Column()
  index: number;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  variables?: Maybe<Variable[]>;

  get isRunning() {
    return isRunning(this.state);
  }

  static createInProgressFromScrapper(scrapper: ScrapperModel, index: number) {
    return this.createFromScrapper(scrapper, RunState.InProgress, index);
  }

  static createPendingFromScrapper(scrapper: ScrapperModel, index: number) {
    return this.createFromScrapper(scrapper, RunState.Pending, index);
  }

  private static createFromScrapper(
    scrapper: ScrapperModel,
    state: RunState,
    index: number
  ) {
    return this.create({
      scrapper,
      steps: scrapper.steps ?? [],
      state,
      variables: scrapper.variables,
      startedAt: new Date(),
      results: scrapper.steps?.map((step) =>
        ScrapperRunStepResultModel.createPendingFromStep(step)
      ),
      runSettings: scrapper.runSettings,
      createdBy: scrapper.createdBy,
      index,
    });
  }
}
