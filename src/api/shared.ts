import Joi from 'joi';
import { BadRequestError } from '../errors';
import { RequestHandler } from '../router';

export interface SimpleMessageResponse {
  message: string;
}

export function validateWithJoi<BODY = unknown>(schema: Joi.Schema): (body: BODY) => body is BODY {
  return (body: BODY): body is BODY => {
    const valid = schema.validate(body);
    if (valid.error) {
      console.error(valid.error);
    }
    return !valid.error;
  };
}

export function validate<BODY = unknown, RESPONSE = unknown>(
  validator: (body: BODY) => body is BODY,
  handler: RequestHandler<BODY, RESPONSE>
): RequestHandler<BODY, RESPONSE> {
  return (data, req, res) => {
    if (!validator(data.body)) {
      throw new BadRequestError('The request body is not in the correct format');
    }

    return handler(data, req, res);
  };
}
