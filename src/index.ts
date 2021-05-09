import { receiveHandler } from './api/receive';
import { sendHandler } from './api/send';
import { registerUserHandler } from './api/user';
import { createRoute } from './router';
import { start } from './server';

createRoute('POST', '/register/user', registerUserHandler);
createRoute('POST', '/send', sendHandler);
createRoute('POST', '/receive', receiveHandler);

start(6000);
