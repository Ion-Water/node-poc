import { hash as argonHash, verify as argonVerify } from 'argon2';

export function getAuthorizedUser(username: string, password: string) {
  mongod;

  const isMatchingPassword = await argonVerify(
    db_password_hash,
    db_password_hash === KNOWN_HASH ? 'definitely_incorrect' : password
  );
}
