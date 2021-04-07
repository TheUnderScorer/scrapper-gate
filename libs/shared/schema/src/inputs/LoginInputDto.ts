import { LoginInput } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { BaseSchema } from '@scrapper-gate/shared/validation';

export class LoginInputDto
  extends BaseSchema<LoginInput>
  implements LoginInput {
  @(jf.string().required())
  password: string;

  @(jf.string().required().email({
    tlds: false,
  }))
  username: string;
}
