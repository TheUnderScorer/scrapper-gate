import {
  enumField,
  JoiMessages,
  LoginInputSchema,
} from '@scrapper-gate/shared/validation';
import joi, { ObjectSchema } from 'joi';
import { LoginFormInput, LoginFormType } from './LoginForm.types';

export const LoginFormSchema = (
  LoginInputSchema as ObjectSchema<LoginFormInput>
).keys({
  acceptTerms: joi.boolean().when('type', {
    is: LoginFormType.Signup,
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
  }),

  type: enumField(LoginFormType).required(),
});
