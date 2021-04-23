import {
  MouseButton,
  ScrapperAction,
  ScrapperStep,
  Selector,
} from '@scrapper-gate/shared/schema';
import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { ScrapperModel } from './Scrapper.model';
import { Entities } from '@scrapper-gate/shared/common';

@Entity(Entities.ScrapperStep)
export class ScrapperStepModel
  extends BaseModel<ScrapperStepModel>
  implements ScrapperStep {
  @Column({
    nullable: true,
  })
  goBackSteps?: number;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @ManyToOne(() => ScrapperStepModel, (model) => model.previousSteps)
  nextStep?: ScrapperStepModel;

  @OneToMany(() => ScrapperStepModel, (model) => model.nextStep)
  previousSteps?: ScrapperStepModel[];

  @Column({
    nullable: true,
  })
  mouseButton?: MouseButton;

  @Column({
    nullable: true,
  })
  url?: string;

  @Column({
    nullable: true,
  })
  navigateToUrl?: string;

  @Column({
    nullable: true,
  })
  reloadDelay?: number;

  @Column({
    nullable: true,
  })
  typeDelay?: number;

  @Column({
    nullable: true,
  })
  useUrlFromPreviousStep?: boolean;

  @Column({
    nullable: true,
  })
  action?: ScrapperAction;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  selectors?: Selector[];

  @ManyToOne(() => ScrapperModel, (model) => model.steps)
  scrapper: ScrapperModel;
}