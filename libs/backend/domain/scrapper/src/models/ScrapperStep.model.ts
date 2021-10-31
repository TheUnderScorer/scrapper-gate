import { BaseModel } from '@scrapper-gate/backend/base-model';
import { makeDataObjectArrayTransformer } from '@scrapper-gate/backend/db-utils';
import { ConditionalRuleGroupModel } from '@scrapper-gate/backend/domain/conditional-rules';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Entities, Enumerable, Setter } from '@scrapper-gate/shared/common';
import {
  Maybe,
  MouseButton,
  NodePosition,
  ScrapperAction,
  ScrapperRunSettings,
  ScrapperStep,
  Selector,
  VariableType,
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
  goBackSteps?: Maybe<number>;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @ManyToOne(() => ScrapperStepModel, (model) => model.previousSteps, {
    cascade: true,
  })
  nextStep?: Maybe<ScrapperStepModel>;

  @OneToMany(() => ScrapperStepModel, (model) => model.nextStep)
  previousSteps?: Maybe<ScrapperStepModel[]>;

  @OneToOne(() => ScrapperStepModel)
  @JoinColumn()
  stepOnFalse?: Maybe<ScrapperStepModel>;

  @OneToOne(() => ScrapperStepModel)
  @JoinColumn()
  stepOnTrue?: Maybe<ScrapperStepModel>;

  @Column({
    nullable: true,
    type: 'enum',
    enum: MouseButton,
  })
  mouseButton?: Maybe<MouseButton>;

  @Column({
    nullable: true,
  })
  url?: Maybe<string>;

  @Column({
    nullable: true,
  })
  navigateToUrl?: Maybe<string>;

  @Column({
    nullable: true,
  })
  reloadDelay?: Maybe<number>;

  @Column({
    nullable: true,
  })
  typeDelay?: Maybe<number>;

  @Column({
    nullable: true,
  })
  useUrlFromPreviousStep?: Maybe<boolean>;

  @Column({
    type: 'enum',
    enum: ScrapperAction,
  })
  action: ScrapperAction;

  @Column({
    nullable: true,
  })
  clickTimes?: Maybe<number>;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  selectors?: Maybe<Selector[]>;

  @ManyToOne(() => ScrapperModel, (model) => model.steps)
  scrapper: ScrapperModel;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  position?: Maybe<NodePosition>;

  @Column({
    nullable: true,
  })
  key?: Maybe<string>;

  @Column({
    nullable: true,
  })
  typeValue?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'jsonb',
    transformer: makeDataObjectArrayTransformer(ConditionalRuleGroupModel),
  })
  @Setter((value?: ConditionalRuleGroupModel[]) =>
    value?.map((val) => ConditionalRuleGroupModel.create(val))
  )
  conditionalRules?: Maybe<ConditionalRuleGroupModel[]>;

  @Column({
    nullable: true,
  })
  isFirst?: Maybe<boolean>;

  @Column({
    nullable: true,
  })
  fullPageScreenshot?: Maybe<boolean>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  newRunSettings?: Maybe<ScrapperRunSettings>;

  @Column({
    nullable: true,
  })
  attributeToRead?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'enum',
    enum: VariableType,
  })
  valueType?: Maybe<VariableType>;

  @Enumerable(true)
  get allSelectors(): Maybe<Selector[]> {
    const selectors = [...(this.selectors ?? [])];

    if (this.conditionalRules?.length) {
      this.conditionalRules.forEach((group) => {
        selectors.push(...group.selectors);
      });
    }

    return selectors;
  }
}
