import {
  Button,
  CircularProgress,
  Fab,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  FormCheckbox,
  FormTextField,
  joiValidationResolver,
} from '@scrapper-gate/frontend/form';
import { ErrorAlert } from '@scrapper-gate/frontend/ui';
import React from 'react';
import { Form } from 'react-final-form';
import { Link } from 'react-router-dom';
import { LoginFormProps, LoginFormType } from './LoginForm.types';
import { LoginFormDto } from './LoginFormDto';
import { useLoginForm } from './useLoginForm';

const StyledForm = styled('form')(() => ({
  width: '100%',
}));

const validate = joiValidationResolver(LoginFormDto);

export const LoginForm = ({
  afterLogin,
  signupUrl,
  type = LoginFormType.Login,
  afterCreate,
  useTokensStore,
}: LoginFormProps) => {
  const { error, loading, handleSubmit } = useLoginForm({
    type,
    afterLogin,
    afterCreate,
    useTokensStore,
  });

  return (
    <Form<LoginFormDto>
      validate={(values) =>
        validate({
          ...values,
          type,
        })
      }
      validateOnBlur={false}
      onSubmit={handleSubmit}
      render={(props) => (
        <StyledForm onSubmit={props.handleSubmit}>
          <Stack direction="column" spacing={3} alignItems="center">
            <ErrorAlert
              sx={{
                marginBottom: 0,
                marginTop: (theme) => theme.spacing(3),
              }}
              error={error}
            />
            <FormTextField
              label="E-mail"
              fullWidth
              size="small"
              name="username"
              variant="filled"
              disabled={loading}
              showErrorOnlyOnTouched
            />
            <FormTextField
              label="Password"
              fullWidth
              size="small"
              name="password"
              variant="filled"
              disabled={loading}
              type="password"
              showErrorOnlyOnTouched
            />
            {type === LoginFormType.Signup && (
              <FormCheckbox
                color="primary"
                label={
                  <>
                    I accept <MuiLink>terms & conditions</MuiLink>
                  </>
                }
                name="acceptTerms"
                fieldProps={{
                  showErrorOnlyOnTouched: true,
                }}
              />
            )}
            <Stack
              sx={{
                width: '100%',
              }}
              spacing={2}
              direction="row"
              alignItems="center"
              justifyContent={
                type === LoginFormType.Login ? 'space-between' : 'center'
              }
            >
              <Fab
                sx={{
                  '&.MuiButtonBase-root': {
                    minWidth: '150px',
                  },
                }}
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
                    <Button
                      className="sign-up"
                      disabled={loading}
                      color="primary"
                      variant="text"
                    >
                      Sign up
                    </Button>
                  </Link>
                </Stack>
              )}
            </Stack>
          </Stack>
        </StyledForm>
      )}
    />
  );
};
