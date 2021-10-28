import {
  AuthTokens,
  CreateUserResult,
  LoginInput,
} from '@scrapper-gate/shared/schema';
import { WithUseTokenStoreHook } from '../../store/useTokensStore';

export enum LoginFormType {
  Login = 'Login',
  Signup = 'Signup',
}

export interface LoginFormProps extends WithUseTokenStoreHook {
  afterLogin?: (tokens: AuthTokens) => void;
  afterCreate?: (result: CreateUserResult) => void;
  signupUrl?: string;
  type?: LoginFormType;
}

export interface LoginFormInput extends LoginInput {
  acceptTerms?: boolean;
}
