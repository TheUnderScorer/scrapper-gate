/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Entities } from '@scrapper-gate/shared/common';
import {
  CreatedBy,
  Maybe,
  Variable,
  VariableScope,
  VariableType,
} from '@scrapper-gate/shared/schema';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

const valueTransformer = {
  from: (value: unknown) => {
    if (!value) {
      return value;
    }

    try {
      return JSON.parse(value as string);
    } catch {
      return value;
    }
  },
  to: (value: unknown) => {
    return typeof value === 'object' ? JSON.stringify(value) : value;
  },
};

@Entity(Entities.Variable)
export class VariableModel
  extends BaseModel<Variable>
  implements Variable, CreatedBy
{
  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  value?: any;

  @Column({
    nullable: true,
    type: 'text',
  })
  key?: Maybe<string>;

  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  defaultValue?: any;

  @Column({
    type: 'enum',
    enum: VariableScope,
  })
  scope: VariableScope;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @Column({
    nullable: true,
    type: 'enum',
    enum: VariableType,
  })
  type?: Maybe<VariableType>;
}
