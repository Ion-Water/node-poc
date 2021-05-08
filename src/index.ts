import { createRoute } from './router';
import { start } from './server';

createRoute('GET', '/', () => {
  return {
    message: 'Yay!',
  };
});

createRoute('GET', '/:param/path', ({ body, parameters }) => {
  return parameters;
});

createRoute<Record<string, string>>('POST', '/', ({ body }) => {
  return {
    message: 'Posted!',
    body,
  };
});

start(6000);
