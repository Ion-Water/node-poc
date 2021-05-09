import { BadAuthorizationError, InternalServerError } from '../errors';
import { RequestData, validate } from '../router';
import { Mailbox, MailboxItem, validUser } from '../store/user';
import { SimpleMessageResponse, validateWithJoi } from './shared';
import Joi from 'joi';

interface ReceiveRequest {
  type: 'receive';
  content: {
    type: 'receive_all'; // TODO: Could receive by user, topic, conversation etc.
  };
  authorization: {
    basic: {
      username: string;
      password: string;
    };
  };
}

interface ReceiveResponse extends SimpleMessageResponse {
  data: MailboxItem[];
}

async function receive({ body }: RequestData<ReceiveRequest>): Promise<ReceiveResponse> {
  const {
    authorization: { basic },
  } = body;

  if (!validUser(basic.username, basic.password)) {
    throw new BadAuthorizationError('You are not authorized to perform this action');
  }

  const self_mailbox = Mailbox.get(basic.username);

  if (!self_mailbox) {
    throw new InternalServerError('Unable to find mailbox');
  }

  Mailbox.set(basic.username, []);

  return {
    message: `Received ${self_mailbox.length} items`,
    data: self_mailbox,
  };
}

export const receiveHandler = validate(
  validateWithJoi(
    Joi.object({
      type: Joi.string().valid('receive').required(),
      content: Joi.object({
        type: Joi.string().valid('receive_all').required(),
      }).required(),
      authorization: Joi.object({
        basic: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }).required(),
      }).required(),
    })
  ),
  receive
);
