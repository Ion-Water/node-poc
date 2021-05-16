import { receiveHandler } from './api/receive';
import { sendHandler } from './api/send';
import { registerUserHandler } from './api/user';
import { createRoute } from './router';
import { start } from './server';
import { config } from 'dotenv';

config();

createRoute('POST', '/register/user', registerUserHandler);
// createRoute('POST', '/login/user', loginUserHandler);
createRoute('POST', '/send', sendHandler);
createRoute('POST', '/receive', receiveHandler);

// https://chromium.googlesource.com/chromium/src.git/+/refs/heads/main/net/base/port_util.cc
// Port 6000 is restricted in chrome!
start(Number(process.env.PORT) || 6006);
