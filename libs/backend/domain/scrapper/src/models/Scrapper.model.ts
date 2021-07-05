import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { VariableModel } from '@scrapper-gate/backend/domain/variables';
import { Entities } from '@scrapper-gate/shared/common';
import { runStates } from '@scrapper-gate/shared/run-states';
import { RunState, Scrapper, ScrapperType } from '@scrapper-gate/shared/schema';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ScrapperRunModel } from './ScrapperRun.model';
import { ScrapperStepModel } from './ScrapperStep.model';

@Entity(Entities.Scrapper)
export class ScrapperModel
  extends BaseModel<ScrapperModel>
  implements Scrapper {
  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @Column({
    nullable: true,
  })
  name?: string;

  @Column({
    nullable: true,
  })
  state?: RunState;

  @OneToMany(() => ScrapperStepModel, (model) => model.scrapper, {
    cascade: true,
  })
  steps: ScrapperStepModel[];

  @OneToMany(() => ScrapperRunModel, (model) => model.scrapper, {
    cascade: true,
  })
  runs: ScrapperRunModel[];

  @ManyToMany(() => VariableModel, {
    cascade: true,
  })
  @JoinTable()
  variables: VariableModel[];

  @Column()
  type: ScrapperType;

  get isRunning() {
    return this.state && runStates.includes(this.state);
  }
}
