// import { RequestData } from '../router';
// import { validate, validateWithJoi } from './shared';

// import {
//   AuthorizationMessage,
//   RegisterUserMessage,
//   RegisterUserMessageSchema,
//   LoginUserMessage,
//   LoginUserSuccess,
//   AnySuccessData,
//   BadAuthorizationError,
//   BadRequestError,
// } from '@ion-water/node-sdk';
// import { UserEntity } from '../entities/User';
// import { getRepository } from 'typeorm';
// import { hash as argonHash, verify as argonVerify } from 'argon2';

// // This hash is the hashed value of 'password';
// const KNOWN_HASH =
//   '$argon2i$v=19$m=4096,t=3,p=1$XLZf0gz5MyGl6Jy99sBd9Q$xGGQcT0Kn1VPcFztbSCpbDxbogcZSjAQuM6qv126Qes';

// async function registerUser({
//   body,
// }: RequestData<AuthorizationMessage<RegisterUserMessage>>): Promise<AnySuccessData> {
//   const { username, password } = body.data.register_user.user;

//   if (!username || !password) {
//     throw new BadRequestError('You must supply a username and password');
//   }

//   const users = getRepository(UserEntity);

//   const existing_user = await users.findOne({ username });

//   if (existing_user) {
//     throw new BadRequestError('User is already registered');
//   }

//   const hashed_password = await argonHash(password);

//   const result = await users.insert({
//     username,
//     password: hashed_password,
//   });

//   console.log(hashed_password, result);

//   return {
//     message: 'User registered',
//   };
// }

// async function loginUser({
//   body,
// }: RequestData<AuthorizationMessage<LoginUserMessage>>): Promise<LoginUserSuccess> {
//   const { username, password } = body.data.login.user;

//   if (!username || !password) {
//     throw new BadRequestError('You must supply a username and password');
//   }

//   const users = getRepository(UserEntity);

//   const existing_user = await users.findOne({ username });

//   const { username: db_username, password: db_password_hash } = existing_user ?? {
//     username: '',
//     password: KNOWN_HASH,
//   };

//   // Why bother hashing at all when you know the user doesnt exist?
//   // By always attempting to hash verify a password, you make sure that attackers cannot
//   // ascertain existing users by returning an error early for a missing DB user.
//   const isMatchingPassword = await argonVerify(
//     db_password_hash,
//     db_password_hash === KNOWN_HASH ? 'definitely_incorrect' : password
//   );

//   if (!isMatchingPassword) {
//     throw new BadAuthorizationError('Invalid username or password');
//   }

//   return {
//     message: 'Logged in successfully',
//     access_token: '',
//   };
// }

// export const registerUserHandler = validate(
//   validateWithJoi(RegisterUserMessageSchema),
//   registerUser
// );
