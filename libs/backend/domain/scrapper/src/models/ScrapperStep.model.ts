import { BaseModel } from '@scrapper-gate/backend/base-model';
import { durationTransformer } from '@scrapper-gate/backend/db-utils';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Duration, Entities, Enumerable } from '@scrapper-gate/shared/common';
import { isHtmlConditionalRule } from '@scrapper-gate/shared/domain/conditional-rules';
import {
  ConditionalRuleGroup,
  Maybe,
  MouseButton,
  NodePosition,
  ScrapperAction,
  ScrapperRunSettings,
  ScrapperStep,
  ScrapperWaitType,
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
    type: 'smallint',
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
    type: 'text',
  })
  url?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'text',
  })
  navigateToUrl?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'integer',
  })
  reloadDelay?: Maybe<number>;

  @Column({
    nullable: true,
    type: 'integer',
  })
  typeDelay?: Maybe<number>;

  @Column({
    nullable: true,
    type: 'boolean',
  })
  useUrlFromPreviousStep?: Maybe<boolean>;

  @Column({
    type: 'enum',
    enum: ScrapperAction,
  })
  action: ScrapperAction;

  @Column({
    nullable: true,
    type: 'smallint',
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
    type: 'text',
  })
  key?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'text',
  })
  typeValue?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  conditionalRules?: Maybe<ConditionalRuleGroup[]>;

  @Column({
    nullable: true,
    type: 'boolean',
  })
  isFirst?: Maybe<boolean>;

  @Column({
    nullable: true,
    type: 'boolean',
  })
  fullPageScreenshot?: Maybe<boolean>;

  @Column({
    nullable: true,
    type: 'jsonb',
  })
  newRunSettings?: Maybe<ScrapperRunSettings>;

  @Column({
    nullable: true,
    type: 'text',
  })
  attributeToRead?: Maybe<string>;

  @Column({
    nullable: true,
    type: 'enum',
    enum: VariableType,
  })
  valueType?: Maybe<VariableType>;

  @Column({
    nullable: true,
    type: 'jsonb',
    transformer: durationTransformer,
  })
  waitDuration?: Maybe<Duration>;

  @Column({
    type: 'enum',
    enum: ScrapperWaitType,
    nullable: true,
  })
  waitType?: Maybe<ScrapperWaitType>;

  @Column({
    nullable: true,
    type: 'jsonb',
    transformer: durationTransformer,
  })
  waitIntervalCheck?: Maybe<Duration>;

  @Column({
    nullable: true,
    type: 'jsonb',
    transformer: durationTransformer,
  })
  waitIntervalTimeout?: Maybe<Duration>;

  @Column({
    nullable: true,
    type: 'text',
  })
  jsCode?: Maybe<string>;

  @Enumerable(true)
  get allSelectors(): Maybe<Selector[]> {
    const selectors = [...(this.selectors ?? [])];

    if (this.conditionalRules?.length) {
      this.conditionalRules.forEach((group) => {
        group.rules?.forEach((rule) => {
          if (isHtmlConditionalRule(rule) && rule.selectors) {
            selectors.push(...rule.selectors);
          }
        });
      });
    }

    return selectors;
  }
}
