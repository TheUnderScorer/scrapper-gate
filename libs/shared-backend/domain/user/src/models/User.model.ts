import { User } from '@scrapper-gate/shared/schema';
import { Column, Entity } from 'typeorm';
import { BaseModel } from '@scrapper-gate/shared-backend/base-model';

@Entity('User')
export class UserModel extends BaseModel<User> implements User {
  @Column()
  email: string;

  @Column({
    nullable: true,
  })
  firstName?: string;

  @Column({
    nullable: true,
  })
  lastName?: string;
}
