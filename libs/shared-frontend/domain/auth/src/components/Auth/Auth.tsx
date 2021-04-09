import React from 'react';
import { Emoji } from '@scrapper-gate/shared-frontend/ui';
import {
  Box,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Stack,
  Typography,
} from '@material-ui/core';
import { AuthFacebookButton } from './FacebookButton/AuthFacebookButton';
import { AuthGoogleButton } from './GoogleButton/AuthGoogleButton';
import {
  LoginForm,
  LoginFormProps,
  LoginFormType,
} from '../LoginForm/LoginForm';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { ArrowBackSharp } from '@material-ui/icons';

export type AuthProps = Pick<LoginFormProps, 'afterLogin' | 'afterCreate'>;

const useStyles = makeStyles((theme) => ({
  container: {
    padding: 0,
    height: '100%',
  },
  stack: {
    flex: 1,
    padding: `0 ${theme.spacing(2)}`,
  },
  box: {
    background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
    color: theme.palette.primary.contrastText,
    padding: `${theme.spacing(5)} 0`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  icon: {
    color: theme.palette.primary.contrastText,
  },
}));

export const Auth = ({ afterLogin, afterCreate }: AuthProps) => {
  const classes = useStyles();
  const match = useRouteMatch();
  const history = useHistory();

  const signupUrl = `${match.path}/sign-up`;

  return (
    <Grid className={classes.container} direction="column" container>
      <Stack justifyContent="center" direction="row" className={classes.box}>
        <Route path={match.path} exact>
          <Typography variant="h5">
            <Emoji>
              Sign in to <strong>Scrapper Gate</strong> 🚀
            </Emoji>
          </Typography>
        </Route>
        <Route path={`${match.path}/sign-up`}>
          <Stack alignItems="center" spacing={2} direction="row">
            <IconButton
              onClick={() => history.push(match.path)}
              size="small"
              className={classes.icon}
            >
              <ArrowBackSharp />
            </IconButton>
            <Typography variant="h5">
              <Emoji>
                Sign up to <strong>Scrapper Gate</strong> 🚀
              </Emoji>
            </Typography>
          </Stack>
        </Route>
      </Stack>
      <Route path={match.path} exact>
        <Stack
          className={classes.stack}
          justifyContent="center"
          alignItems="center"
          direction="column"
          spacing={2}
        >
          <LoginForm afterLogin={afterLogin} signupUrl={signupUrl} />
          <Box width="100%">
            <Divider variant="fullWidth">OR</Divider>
          </Box>
          <Stack direction="row" spacing={2} justifyContent="center">
            <AuthFacebookButton />
            <AuthGoogleButton />
          </Stack>
        </Stack>
      </Route>
      <Route path={signupUrl}>
        <Box paddingLeft={2} paddingRight={2}>
          <LoginForm
            signupUrl={signupUrl}
            afterCreate={afterCreate}
            type={LoginFormType.Signup}
          />
        </Box>
      </Route>
    </Grid>
  );
};
