import http from 'http';
import { route } from './router';

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    console.log(req.url);
    const response = await route(req);
    res.write(
      JSON.stringify({
        type: 'success',
        data: response,
      })
    );
    res.end();
  } catch (exception) {
    res.statusCode = 500;
    res.write(
      JSON.stringify({
        type: 'error',
        data: {
          message: exception.message,
        },
      })
    );
    res.end();
  }
});

export const start = (port: number): http.Server => server.listen(port);
