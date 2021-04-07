import { LoginDocument } from '@scrapper-gate/shared-frontend/schema';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  LoginMutation,
  LoginMutationVariables,
} from '@scrapper-gate/shared/schema';
import {
  LoginForm,
  LoginFormProps,
} from '@scrapper-gate/shared-frontend/domain/auth';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import React from 'react';

const mocks: MockedResponse[] = [
  {
    request: {
      query: LoginDocument,
      variables: {
        input: {
          username: 'test@test.com',
          password: 'password',
        },
      } as LoginMutationVariables,
    },
    result: {
      data: {
        login: {
          accessToken: '#token',
          refreshToken: '#refresh_token',
        },
      } as LoginMutation,
    },
  },
];

const renderComponent = (props?: LoginFormProps): RenderResult => {
  let cmp: RenderResult;

  act(() => {
    cmp = render(
      <MockedProvider mocks={mocks}>
        <LoginForm {...props} />
      </MockedProvider>
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return cmp!;
};

describe('<LoginForm />', () => {
  it('should render without crashing', () => {
    const cmp = renderComponent();
    expect(cmp).toMatchSnapshot();
  });

  it('should handle login', async () => {
    const handleLogin = jest.fn();

    const { container } = renderComponent({
      afterLogin: handleLogin,
    });

    const username = container.querySelector('#username');
    const password = container.querySelector('#password');
    const loginBtn = container.querySelector('#login');

    await act(async () => {
      await fireEvent.type(username, 'test@test.com', {
        delay: 10,
      });

      await fireEvent.type(password, 'password', {
        delay: 10,
      });
    });

    await act(async () => {
      fireEvent.click(loginBtn);
    });

    await waitFor(() => expect(handleLogin).toHaveBeenCalledTimes(1));
  });
});
