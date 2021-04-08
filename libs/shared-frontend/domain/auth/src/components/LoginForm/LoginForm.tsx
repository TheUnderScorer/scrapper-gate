import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  AuthTokens,
  LoginInput,
  LoginInputDto,
} from '@scrapper-gate/shared/schema';
import { useLoginMutation } from '@scrapper-gate/shared-frontend/schema';
import { useTokensStore } from '@scrapper-gate/shared-frontend/domain/auth';
import {
  FormTextField,
  joiValidationResolver,
} from '@scrapper-gate/shared-frontend/form';
import {
  Button,
  CircularProgress,
  Fab,
  makeStyles,
  Stack,
  Typography,
} from '@material-ui/core';
import { ErrorAlert } from '@scrapper-gate/shared-frontend/ui';
import { Link } from 'react-router-dom';

export interface LoginFormProps {
  afterLogin?: (tokens: AuthTokens) => void;
  signupUrl: string;
}

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
  },
  alert: {
    marginBottom: 0,
    marginTop: theme.spacing(3),
  },
  action: {
    width: '100%',
  },
  fab: {
    '&.MuiButtonBase-root': {
      minWidth: '150px',
    },
  },
}));

export const LoginForm = ({ afterLogin, signupUrl }: LoginFormProps) => {
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
      <Stack direction="column" spacing={3} alignItems="center">
        <ErrorAlert className={classes.alert} error={error} />
        <FormTextField
          id="username"
          control={form.control}
          label="E-mail"
          fullWidth
          size="small"
          name="username"
          variant="filled"
          disabled={loading}
        />
        <FormTextField
          id="password"
          control={form.control}
          label="Password"
          fullWidth
          size="small"
          name="password"
          variant="filled"
          disabled={loading}
          type="password"
        />

        <Stack
          className={classes.action}
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Fab
            className={classes.fab}
            id="login"
            disabled={loading}
            type="submit"
            variant="extended"
            color={loading ? 'default' : 'primary'}
          >
            {loading ? <CircularProgress size={25} /> : 'Login'}
          </Fab>
          <Stack alignItems="center" direction="row">
            <Typography variant="caption">Don't have account?</Typography>
            <Link to={signupUrl}>
              <Button disabled={loading} color="primary" variant="text">
                Sign up
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>
    </form>
  );
};
