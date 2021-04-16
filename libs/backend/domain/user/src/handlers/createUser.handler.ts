import { commandHandler } from 'functional-cqrs';
import { CreateUserCommand } from '../commands/CreateUser.command';
import { UserRepository } from '../repositories/User.repository';
import {
  EmailAlreadyTakenError,
  HttpError,
} from '@scrapper-gate/shared/errors';
import { SecurityClient } from '@tshio/security-client';
import { Roles } from '../roles';
import { UserModel } from '../models/User.model';
import { UserCreatedEvent } from '../events/UserCreated.event';
import { CreateUserResult } from '@scrapper-gate/shared/schema';
import { StatusCodes } from 'http-status-codes';

export interface CreateUserHandlerDependencies {
  userRepository: UserRepository;
  securityClient: SecurityClient;
  securityApiKey: string;
}

export const createUserHandler = commandHandler.asFunction<
  CreateUserCommand,
  CreateUserHandlerDependencies
>(
  CreateUserCommand.name,
  async ({
    context: { userRepository, securityClient, eventsBus, securityApiKey },
    command: { payload },
  }) => {
    const userByEmail = await userRepository.findByEmail(payload.input.email);

    if (userByEmail) {
      throw new EmailAlreadyTakenError(payload.input.email);
    }

    if (!payload.input.acceptTerms) {
      throw new HttpError(
        'You have to accept terms and conditions.',
        StatusCodes.BAD_REQUEST
      );
    }

    const addUserResult = await securityClient.users.addUser(
      {
        username: payload.input.email,
        password: payload.input.password,
        attributes: [Roles.User],
      },
      {
        apiKey: securityApiKey,
      }
    );

    const user = UserModel.create({
      id: addUserResult.newUserId,
      email: payload.input.email,
      acceptTerms: payload.input.acceptTerms,
    });

    await userRepository.save(user);

    const tokens = await securityClient.auth.login({
      username: payload.input.email,
      password: payload.input.password,
    });

    await eventsBus.dispatch(
      new UserCreatedEvent({
        user,
      })
    );

    return {
      user,
      tokens,
    } as CreateUserResult;
  }
);
