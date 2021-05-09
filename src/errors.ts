interface HttpErrorData {
  message: string;
}
export abstract class HttpError extends Error {
  abstract statusCode: number;
  abstract errorCode: string;
  abstract get data(): HttpErrorData;
}

export class BadRequestError extends HttpError {
  statusCode = 400;
  errorCode = 'bad_request';

  constructor(message: string, errorCode?: string) {
    super(message);

    this.errorCode = errorCode || this.errorCode;
  }

  get data(): HttpErrorData {
    return {
      message: this.message,
    };
  }
}

export class BadAuthorizationError extends HttpError {
  statusCode = 401;
  errorCode = 'bad_authorization';

  constructor(message: string, errorCode?: string) {
    super(message);

    this.errorCode = errorCode || this.errorCode;
  }

  get data(): HttpErrorData {
    return {
      message: this.message,
    };
  }
}

export class InternalServerError extends HttpError {
  statusCode = 500;
  errorCode = 'server';

  constructor(message: string, errorCode?: string) {
    super(message);

    this.errorCode = errorCode || this.errorCode;
  }

  get data(): HttpErrorData {
    return {
      message: this.message,
    };
  }
}
