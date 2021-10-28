import {
  useCreateUserMutation,
  useLoginMutation,
} from '@scrapper-gate/frontend/schema';
import { useCallback, useState } from 'react';
import {
  LoginFormInput,
  LoginFormProps,
  LoginFormType,
} from './LoginForm.types';

interface UseLoginFormParams
  extends Pick<
    LoginFormProps,
    'afterLogin' | 'afterCreate' | 'useTokensStore'
  > {
  type: LoginFormType;
}

export function useLoginForm({
  type,
  afterLogin,
  afterCreate,
  useTokensStore,
}: UseLoginFormParams) {
  const [error, setError] = useState<Error | null>(null);
  const [login, { loading: loginLoading }] = useLoginMutation();
  const [signUp, { loading: signupLoading }] = useCreateUserMutation();

  const loading = loginLoading || signupLoading;

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

          if (data?.login) {
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
              acceptTerms: Boolean(input.acceptTerms),
            },
          },
        });

        if (data?.createUser) {
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

  /*  useEffect(() => {
    setValue('type', type);
  }, [type, setValue]);*/

  return { error, loading, handleSubmit };
}
