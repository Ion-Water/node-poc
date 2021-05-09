import { BadRequestError } from '../errors';
import { RequestData, validate } from '../router';
import { Mailbox, Users } from '../store/user';
import { SimpleMessageResponse, validateWithJoi } from './shared';
import Joi from 'joi';

interface RegisterUserRequest {
  type: 'authorization';
  data: {
    type: 'register_user';
    register_user: {
      method: 'basic_auth';
      user: {
        username: string;
        password: string;
      };
    };
  };
}

async function registerUser({
  body,
}: RequestData<RegisterUserRequest>): Promise<SimpleMessageResponse> {
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
  validateWithJoi(
    Joi.object({
      type: Joi.string().valid('authorization').required(),
      data: Joi.object({
        type: Joi.string().valid('register_user').required(),
        register_user: Joi.object({
          method: Joi.string().valid('basic_auth').required(),
          user: Joi.object({
            username: Joi.string().required().empty(),
            password: Joi.string().required().empty(),
          }).required(),
        }).required(),
      }).required(),
    })
  ),
  registerUser
);
