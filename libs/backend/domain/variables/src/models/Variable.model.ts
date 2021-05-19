import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';
import { Variable } from '@scrapper-gate/shared/schema';
import { Column, Entity } from 'typeorm';

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
export class VariableModel extends BaseModel<Variable> implements Variable {
  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  value: unknown;

  @Column()
  key: string;

  @Column({
    type: 'text',
    transformer: valueTransformer,
    nullable: true,
  })
  defaultValue: unknown;
}
