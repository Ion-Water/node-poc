import { BadRequestError } from '../errors';
import { RequestData } from '../router';
import { Mailbox, Users } from '../store/user';
import { SimpleMessageResponse, validate, validateWithJoi } from './shared';

import {
  AuthorizationMessage,
  RegisterUserMessage,
  RegisterUserMessageSchema,
} from '@ion-water/node-sdk';

async function registerUser({
  body,
}: RequestData<AuthorizationMessage<RegisterUserMessage>>): Promise<SimpleMessageResponse> {
  const { username, password } = body.data.register_user.user;

  if (!username || !password) {
    throw new BadRequestError('You must supply a username and password');
  }

  if (Users.get(username)) {
    throw new BadRequestError('User is already registered');
  }

  Users.set(username, {
    username,
    authorization: {
      basic: {
        password,
      },
    },
  });

  Mailbox.set(username, []);

  return {
    message: 'User registered',
  };
}

export const registerUserHandler = validate(
  validateWithJoi(RegisterUserMessageSchema),
  registerUser
);
