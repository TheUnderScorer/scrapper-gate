import { BaseModel } from '@scrapper-gate/backend/base-model';
import { UserModel } from '@scrapper-gate/backend/domain/user';
import { Entities } from '@scrapper-gate/shared/common';
import {
  CreatedBy,
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
  implements Variable, CreatedBy {
  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  value: unknown;

  @Column({
    nullable: true,
  })
  key?: string;

  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  defaultValue: unknown;

  @Column()
  scope: VariableScope;

  @ManyToOne(() => UserModel)
  @JoinColumn()
  createdBy: UserModel;

  @Column({
    nullable: true,
  })
  type?: VariableType;
}
