interface BasicUserCredentials {
  password: string;
}

interface AuthorizationData {
  basic: BasicUserCredentials;
}

interface User {
  username: string;
  authorization: AuthorizationData;
}

export interface MailboxItem {
  time: number;
  structure_id: string;
  structure: unknown;
}

export function validUser(username: string, password: string): boolean {
  const user = Users.get(username);

  if (!user || !user.authorization || !user.authorization.basic) {
    return false;
  }

  return user.authorization.basic.password === password;
}

export const Users = new Map<string, User>();
export const Mailbox = new Map<string, MailboxItem[]>();
