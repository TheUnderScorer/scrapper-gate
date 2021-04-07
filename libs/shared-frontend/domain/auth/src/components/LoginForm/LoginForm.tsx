import React, { useCallback, useState } from 'react';
import { AuthTokens } from '@scrapper-gate/shared/domain/auth';
import { useForm } from 'react-hook-form';
import { LoginInput, LoginInputDto } from '@scrapper-gate/shared/schema';
import { useLoginMutation } from '@scrapper-gate/shared-frontend/schema';
import { useTokensStore } from '@scrapper-gate/shared-frontend/domain/auth';
import {
  FormTextField,
  joiValidationResolver,
} from '@scrapper-gate/shared-frontend/form';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@material-ui/core';
import { Emoji, ErrorAlert } from '@scrapper-gate/shared-frontend/ui';
import { makeStyles } from '@material-ui/styles';

export interface LoginFormProps {
  afterLogin?: (tokens: AuthTokens) => void;
}

const useStyles = makeStyles({
  form: {
    width: '100%',
    height: '100%',
  },
});

export const LoginForm = ({ afterLogin }: LoginFormProps) => {
  const classes = useStyles();

  const [error, setError] = useState<Error | null>(null);
  const [login, { loading }] = useLoginMutation();

  const form = useForm({
    resolver: joiValidationResolver(LoginInputDto),
  });

  const setTokens = useTokensStore((store) => store.setTokens);

  const handleSubmit = useCallback(
    async (input: LoginInput) => {
      try {
        setError(null);

        const { data } = await login({
          variables: {
            input,
          },
        });

        if (data.login) {
          setTokens(data.login);

          afterLogin?.(data.login);
        }
      } catch (e) {
        console.log(e);
        if (e?.networkError?.result?.error) {
          setError(new Error(e.networkError.result.error));
        } else {
          setError(e);
        }
      }
    },
    [setTokens, login, afterLogin]
  );

  return (
    <form className={classes.form} onSubmit={form.handleSubmit(handleSubmit)}>
      <Stack direction="column" spacing={2} alignItems="center">
        <Box>
          <Typography variant="h5">
            <Emoji>
              Sign in to <strong>Scrapper Gate</strong> 🚀
            </Emoji>
          </Typography>
        </Box>
        <ErrorAlert error={error} />
        <FormTextField
          id="username"
          control={form.control}
          label="E-mail"
          fullWidth
          size="small"
          name="username"
          variant="outlined"
          disabled={loading}
        />
        <FormTextField
          id="password"
          control={form.control}
          label="Password"
          fullWidth
          size="small"
          name="password"
          variant="outlined"
          disabled={loading}
          type="password"
        />
        <Button
          id="login"
          disabled={loading}
          type="submit"
          fullWidth
          variant={loading ? 'text' : 'contained'}
        >
          {loading ? <CircularProgress size={25} /> : 'Login'}
        </Button>
        <Stack
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="body2">Don't have account?</Typography>
          <Button disabled={loading} color="primary">
            Sign up
          </Button>
        </Stack>
      </Stack>
    </form>
  );
};
