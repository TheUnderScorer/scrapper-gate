import {
  CreateUserDocument,
  LoginDocument,
} from '@scrapper-gate/frontend/schema';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  CreateUserMutation,
  CreateUserMutationVariables,
  LoginMutation,
  LoginMutationVariables,
} from '@scrapper-gate/shared/schema';
import {
  LoginForm,
  LoginFormProps,
  LoginFormType,
  useTokensStore,
} from '@scrapper-gate/frontend/domain/auth';
import { act, render, RenderResult, waitFor } from '@testing-library/react';
import fireEvent from '@testing-library/user-event';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { createMockUser } from '@scrapper-gate/shared/domain/user';

const user = createMockUser();

const createUserResult = {
  tokens: {
    accessToken: '#token',
    refreshToken: '#refresh_token',
  },
  user,
};

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
  {
    request: {
      query: CreateUserDocument,
      variables: {
        input: {
          email: 'test@test.com',
          password: 'password',
        },
      } as CreateUserMutationVariables,
    },
    result: {
      data: {
        createUser: createUserResult,
      } as CreateUserMutation,
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

const fillFields = async (container: HTMLElement) => {
  const username = container.querySelector('#username');
  const password = container.querySelector('#password');

  await act(async () => {
    await fireEvent.type(username, 'test@test.com', {
      delay: 10,
    });

    await fireEvent.type(password, 'password', {
      delay: 10,
    });
  });
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

    const loginBtn = container.querySelector('#login');

    await fillFields(container);

    await act(async () => {
      userEvent.click(loginBtn);
    });

    await waitFor(() => expect(handleLogin).toHaveBeenCalledTimes(1));
  });

  it('should handle signup', async () => {
    const handleCreate = jest.fn();

    const { container } = renderComponent({
      afterCreate: handleCreate,
      type: LoginFormType.Signup,
    });

    await fillFields(container);

    const signupBtn = container.querySelector('#signup');

    act(() => {
      userEvent.click(signupBtn);
    });

    await waitFor(() => expect(handleCreate).toHaveBeenCalledTimes(1));
    expect(handleCreate).toHaveBeenCalledWith(createUserResult);
    expect(useTokensStore.getState().tokens).toEqual(createUserResult.tokens);
  });
});
