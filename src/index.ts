import { createRoute } from './router';
import { start } from './server';

start(6000);

createRoute('GET', '/', () => {
  return {
    message: 'Yay!',
  };
});
