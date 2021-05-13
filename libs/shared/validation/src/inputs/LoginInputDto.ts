import { LoginInput } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '../BaseSchema';

export class LoginInputDto
  extends BaseSchema<LoginInput>
  implements LoginInput {
  @(jf.string().required().min(8))
  password: string;

  @(jf.string().required().email({
    tlds: false,
  }))
  username: string;
}
