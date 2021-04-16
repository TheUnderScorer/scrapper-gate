import { LoginInputDto } from '@scrapper-gate/shared/schema';
import * as jf from 'joiful';
import { LoginFormInput, LoginFormType } from './LoginForm.types';
import { JoiMessages } from '@scrapper-gate/shared/validation';

export class LoginFormDto extends LoginInputDto implements LoginFormInput {
  @jf.string()
  type: LoginFormType;

  @(jf.boolean().custom(({ joi }) => {
    return joi.when('type', {
      is: joi.string().equal(LoginFormType.Signup),
      then: joi
        .boolean()
        .required()
        .equal(true)
        .options({
          messages: {
            [JoiMessages.Only]: 'You must accept terms and conditions.',
            [JoiMessages.Required]: 'You must accept terms and conditions.',
          },
        }),
    });
  }))
  acceptTerms?: boolean;
}
