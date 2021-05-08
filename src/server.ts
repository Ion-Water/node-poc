import http, { IncomingMessage } from 'http';
import { route } from './router';

async function readBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = Buffer.from('', 'utf-8');

    request
      .on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
      })
      .on('end', () => {
        if (body.length > 0) {
          resolve(JSON.parse(body.toString('utf-8')));
        } else {
          resolve(undefined);
        }
      })
      .on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  try {
    console.log(req.url);
    const body = await readBody(req);
    const response = await route(req, body);
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
