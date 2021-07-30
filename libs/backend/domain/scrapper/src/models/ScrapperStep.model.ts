import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Entities } from '@scrapper-gate/shared/common';
import {
  ConditionalRuleGroup,
  MouseButton,
  NodePosition,
  ScrapperAction,
  ScrapperStep,
  Selector,
} from '@scrapper-gate/shared/schema';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ScrapperModel } from './Scrapper.model';

@Entity(Entities.ScrapperStep)
export class ScrapperStepModel
  extends BaseModel<ScrapperStepModel>
  implements ScrapperStep
{
  @Column({
    nullable: true,
  })
  goBackSteps?: number;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @ManyToOne(() => ScrapperStepModel, (model) => model.previousSteps, {
    cascade: true,
  })
  nextStep?: ScrapperStepModel;

  @OneToMany(() => ScrapperStepModel, (model) => model.nextStep)
  previousSteps?: ScrapperStepModel[];

  @OneToOne(() => ScrapperStepModel)
  @JoinColumn()
  stepOnFalse?: ScrapperStepModel;

  @OneToOne(() => ScrapperStepModel)
  @JoinColumn()
  stepOnTrue?: ScrapperStepModel;

  @Column({
    nullable: true,
    type: 'enum',
    enum: MouseButton,
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
    type: 'enum',
    enum: ScrapperAction,
  })
  action?: ScrapperAction;

  @Column({
    nullable: true,
  })
  clickTimes?: number;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  selectors?: Selector[];

  @ManyToOne(() => ScrapperModel, (model) => model.steps)
  scrapper: ScrapperModel;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  position?: NodePosition;

  @Column({
    nullable: true,
  })
  key?: string;

  @Column({
    nullable: true,
  })
  typeValue?: string;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  conditionalRules?: ConditionalRuleGroup[];
}
