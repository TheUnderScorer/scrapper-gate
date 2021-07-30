import { DataObject } from '@scrapper-gate/shared/common';
import { BaseEntity } from '@scrapper-gate/shared/schema';
import {
  BeforeInsert,
  Column,
  DeleteDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';

export class BaseModel<T> extends DataObject<T> implements BaseEntity {
  @PrimaryColumn({
    type: 'uuid',
  })
  id: string;

  @Column()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @BeforeInsert()
  generateId(force?: boolean) {
    if (this.id && !force) {
      return this;
    }

    this.id = uuid();

    return this;
  }

  @BeforeInsert()
  setCreatedAt() {
    if (this.createdAt) {
      return;
    }

    this.createdAt = new Date();
  }
}
