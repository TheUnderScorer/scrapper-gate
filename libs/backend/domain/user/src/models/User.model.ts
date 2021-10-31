import { Maybe, User } from '@scrapper-gate/shared/schema';
import { Column, Entity } from 'typeorm';
import { BaseModel } from '@scrapper-gate/backend/base-model';
import { Entities } from '@scrapper-gate/shared/common';

@Entity(Entities.User)
export class UserModel extends BaseModel<User> implements User {
  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  firstName?: Maybe<string>;

  @Column({
    nullable: true,
  })
  lastName?: Maybe<string>;

  @Column()
  acceptTerms: boolean;
}
