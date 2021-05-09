import { BadAuthorizationError, BadRequestError } from '../errors';
import { RequestData, validate } from '../router';
import { Mailbox, validUser } from '../store/user';
import { SimpleMessageResponse, validateWithJoi } from './shared';
import Joi from 'joi';
import { v4 as uuid } from 'uuid';

interface SendMessageRequest {
  type: 'send';
  target: string;
  // conversation?: string; // TODO: Should be able to link messages together
  content: {
    // TODO: This can actually be anything, it's up to the client to understand it.
    // This is just a hardcoding of a hypothetical "message" type of content
    type: 'message';
    message: {
      subject: string;
      body: string;
    };
  };
  authorization: {
    basic: {
      username: string;
      password: string;
    };
  };
}

interface SendResponse extends SimpleMessageResponse {
  structure_id: string;
}

async function send({ body }: RequestData<SendMessageRequest>): Promise<SendResponse> {
  const {
    target,
    content,
    authorization: { basic },
  } = body;

  if (!validUser(basic.username, basic.password)) {
    throw new BadAuthorizationError('You are not authorized to perform this action');
  }

  const target_mailbox = Mailbox.get(target);

  if (!target_mailbox) {
    throw new BadRequestError('Unable to find target');
  }
  const structure_id = uuid();

  target_mailbox.push({
    structure_id,
    structure: content,
    time: new Date().getTime(),
  });

  return {
    structure_id,
    message: 'Sent to target mailbox',
  };
}

export const sendHandler = validate(
  validateWithJoi(
    Joi.object({
      type: Joi.string().valid('send').required(),
      target: Joi.string().required(),
      content: Joi.object({
        type: Joi.string().valid('message').required(),
        message: Joi.object({
          subject: Joi.string().required().empty(),
          body: Joi.string().required().empty(),
        }).required(),
      }).required(),
      authorization: Joi.object({
        basic: Joi.object({
          username: Joi.string().required(),
          password: Joi.string().required(),
        }).required(),
      }).required(),
    })
  ),
  send
);
