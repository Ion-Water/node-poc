import { RequestData } from '../router';
import { validate, validateWithJoi } from './shared';

import {
  AuthorizationMessage,
  RegisterUserMessageBody,
  RegisterUserMessageSchema,
  LoginUserMessageBody,
  LoginUserSuccess,
  AnySuccessData,
  BadAuthorizationError,
  BadRequestError,
  LoginUserMessageSchema,
  InternalServerError,
} from '@ion-water/node-sdk';

import { UserEntity } from '../entities/User';
import { hash as argonHash, verify as argonVerify } from 'argon2';
import { newSession, SessionEntity } from '../entities/Session';
import { parseISO } from 'date-fns';
import { getMongoClient } from '../mongo';
import { v4 as uuid } from 'uuid';

// This hash is the hashed value of 'password';
const KNOWN_HASH =
  '$argon2i$v=19$m=4096,t=3,p=1$XLZf0gz5MyGl6Jy99sBd9Q$xGGQcT0Kn1VPcFztbSCpbDxbogcZSjAQuM6qv126Qes';

async function registerUser({
  body,
}: RequestData<AuthorizationMessage<RegisterUserMessageBody>>): Promise<AnySuccessData> {
  const { username, password } = body.data.register_user.user;

  if (!username || !password) {
    throw new BadRequestError('You must supply a username and password');
  }

  const mongo = await getMongoClient();

  if (mongo === null) {
    throw new InternalServerError('Unable to connect to MongoDB');
  }

  const authdb = mongo.db('ionwater').collection('authentication');

  const existing_user = await authdb.findOne({ username });

  if (existing_user) {
    throw new BadRequestError('User is already registered');
  }

  const authentication_key = await argonHash(password);

  const result = await authdb.insertOne({
    user_id: uuid(),
    username,
    authentication_key,
  });

  console.log(authentication_key, result);

  return {
    message: 'User registered',
    user_id: result.insertedId,
  };
}

async function loginUser({
  body,
}: RequestData<AuthorizationMessage<LoginUserMessageBody>>): Promise<LoginUserSuccess> {
  const { username, password } = body.data.login.user;

  if (!username || !password) {
    throw new BadRequestError('You must supply a username and password');
  }

  const users = getRepository(UserEntity);

  const existing_user = await users.findOne({ username });

  const { password: db_password_hash } = existing_user ?? {
    password: KNOWN_HASH,
  };

  // Why bother hashing at all when you know the user doesnt exist?
  // By always attempting to hash verify a password, you make sure that attackers cannot
  // ascertain existing users by returning an error early for a missing DB user.
  const isMatchingPassword = await argonVerify(
    db_password_hash,
    db_password_hash === KNOWN_HASH ? 'definitely_incorrect' : password
  );

  if (!isMatchingPassword || !existing_user) {
    throw new BadAuthorizationError('Invalid username or password');
  }

  const session = newSession();

  const session_entity = new SessionEntity(session);

  const sessions = getRepository(SessionEntity);

  session_entity.user = existing_user;

  sessions.save(session_entity);

  return {
    message: 'Logged in successfully',
    username,
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expiry: parseISO(session.created_at).getTime() + session.valid_for,
  };
}

export const loginUserHandler = validate(validateWithJoi(LoginUserMessageSchema), loginUser);

export const registerUserHandler = validate(
  validateWithJoi(RegisterUserMessageSchema),
  registerUser
);
