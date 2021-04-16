import React from 'react';
import { FormCheckbox, FormTextField } from '@scrapper-gate/frontend/form';
import {
  Button,
  CircularProgress,
  Fab,
  Link as MuiLink,
  makeStyles,
  Stack,
  Typography,
} from '@material-ui/core';
import { ErrorAlert } from '@scrapper-gate/frontend/ui';
import { Link } from 'react-router-dom';
import { LoginFormProps, LoginFormType } from './LoginForm.types';
import { useLoginForm } from './useLoginForm';

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

export const LoginForm = ({
  afterLogin,
  signupUrl,
  type = LoginFormType.Login,
  afterCreate,
}: LoginFormProps) => {
  const classes = useStyles();
  const { error, loading, form, handleSubmit } = useLoginForm({
    type,
    afterLogin,
    afterCreate,
  });

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
        {type === LoginFormType.Signup && (
          <FormCheckbox
            control={form.control}
            color="primary"
            label={
              <>
                I accept <MuiLink>terms & conditions</MuiLink>
              </>
            }
            name="acceptTerms"
          />
        )}
        <Stack
          className={classes.action}
          spacing={2}
          direction="row"
          alignItems="center"
          justifyContent={
            type === LoginFormType.Login ? 'space-between' : 'center'
          }
        >
          <Fab
            className={classes.fab}
            id={type === LoginFormType.Login ? 'login' : 'signup'}
            disabled={loading}
            type="submit"
            variant="extended"
            color={loading ? 'default' : 'primary'}
          >
            {loading ? (
              <CircularProgress size={25} />
            ) : type === LoginFormType.Login ? (
              'Login'
            ) : (
              'Signup'
            )}
          </Fab>
          {signupUrl && type === LoginFormType.Login && (
            <Stack alignItems="center" direction="row">
              <Typography variant="caption">Don't have account?</Typography>
              <Link to={signupUrl}>
                <Button disabled={loading} color="primary" variant="text">
                  Sign up
                </Button>
              </Link>
            </Stack>
          )}
        </Stack>
      </Stack>
    </form>
  );
};
