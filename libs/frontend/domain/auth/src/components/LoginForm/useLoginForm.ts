import { LoginFormInput, LoginFormType } from './LoginForm.types';
import { AuthTokens, CreateUserResult } from '@scrapper-gate/shared/schema';
import { useCallback, useState } from 'react';
import {
  useCreateUserMutation,
  useLoginMutation,
} from '@scrapper-gate/frontend/schema';
import { useForm } from 'react-hook-form';
import { joiValidationResolver } from '@scrapper-gate/frontend/form';
import { LoginFormDto } from './LoginFormDto';
import { useTokensStore } from '../../store/useTokensStore';

interface UseLoginFormParams {
  type: LoginFormType;
  afterLogin: (tokens: AuthTokens) => void;
  afterCreate: (result: CreateUserResult) => void;
}

export function useLoginForm({
  type,
  afterLogin,
  afterCreate,
}: UseLoginFormParams) {
  const [error, setError] = useState<Error | null>(null);
  const [login, { loading: loginLoading }] = useLoginMutation({
    refetchQueries: ['GetCurrentUser'],
  });
  const [signUp, { loading: signupLoading }] = useCreateUserMutation({
    refetchQueries: ['GetCurrentUser'],
  });

  const loading = loginLoading || signupLoading;

  const form = useForm<LoginFormInput>({
    resolver: joiValidationResolver(LoginFormDto),
  });

  const setTokens = useTokensStore((store) => store.setTokens);

  const handleSubmit = useCallback(
    async (input: LoginFormInput) => {
      try {
        setError(null);

        if (type === LoginFormType.Login) {
          const { data } = await login({
            variables: {
              input: {
                password: input.password,
                username: input.username,
              },
            },
          });

          if (data.login) {
            setTokens(data.login);

            afterLogin?.(data.login);
          }

          return;
        }

        const { data } = await signUp({
          variables: {
            input: {
              password: input.password,
              email: input.username,
              acceptTerms: input.acceptTerms,
            },
          },
        });

        if (data.createUser) {
          afterCreate?.(data.createUser);

          setTokens(data.createUser.tokens);
        }
      } catch (e) {
        if (e?.networkError?.result?.error) {
          setError(new Error(e.networkError.result.error));
        } else {
          setError(e);
        }
      }
    },
    [type, signUp, login, setTokens, afterLogin, afterCreate]
  );

  return { error, loading, form, handleSubmit };
}
