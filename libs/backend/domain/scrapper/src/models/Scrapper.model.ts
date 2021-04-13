import { RunState, Scrapper } from '@scrapper-gate/shared/schema';
import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { ScrapperStepModel } from './ScrapperStep.model';
import { Entities, runStates } from '@scrapper-gate/shared/common';

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

  get isRunning() {
    return this.state && runStates.includes(this.state);
  }
}
