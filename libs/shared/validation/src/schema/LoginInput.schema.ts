import { LoginInput } from '@scrapper-gate/shared/schema';
import joi from 'joi';

export const LoginInputSchema = joi.object<LoginInput>({
  username: joi.string().required().email({
    tlds: false,
  }),
  password: joi.string().required().min(8),
});
