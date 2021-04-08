import { BaseEntity } from '@scrapper-gate/shared/schema';
import { DataObject } from '@scrapper-gate/shared/common';
import { BeforeInsert, Column, PrimaryColumn, UpdateDateColumn } from 'typeorm';
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

  @BeforeInsert()
  generateId() {
    if (this.id) {
      return;
    }

    this.id = uuid();
  }

  @BeforeInsert()
  setCreatedAt() {
    if (this.createdAt) {
      return;
    }

    this.createdAt = new Date();
  }
}
