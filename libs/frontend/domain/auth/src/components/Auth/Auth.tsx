import {
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ArrowBackSharp } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { AppTheme } from '@scrapper-gate/frontend/theme';
import { Emoji } from '@scrapper-gate/frontend/ui';
import classNames from 'classnames';
import React from 'react';
import { Route, useHistory, useRouteMatch } from 'react-router-dom';
import { LoginForm } from '../LoginForm/LoginForm';
import { LoginFormProps, LoginFormType } from '../LoginForm/LoginForm.types';
import { AuthFacebookButton } from './FacebookButton/AuthFacebookButton';
import { AuthGoogleButton } from './GoogleButton/AuthGoogleButton';

export type AuthProps = Pick<LoginFormProps, 'afterLogin' | 'afterCreate'>;

const useStyles = makeStyles((theme: AppTheme) => ({
  container: {
    padding: 0,
    height: '100%',
  },
  stack: {
    flex: 1,
    padding: `0 ${theme.spacing(2)}`,
  },
  box: {
    background: theme.palette.gradients.primaryMainToDark,
    color: theme.palette.primary.contrastText,
    height: theme.spacing(12),
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
    <Grid
      className={classNames(classes.container, 'auth')}
      direction="column"
      container
    >
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
            <Tooltip title="Go back">
              <IconButton
                onClick={() => history.push(match.path)}
                className={classes.icon}
              >
                <ArrowBackSharp />
              </IconButton>
            </Tooltip>
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
