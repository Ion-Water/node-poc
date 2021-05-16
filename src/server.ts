import http, { IncomingMessage } from 'http';
import { HttpError } from './errors';
import { route } from './router';

async function readBody(request: IncomingMessage): Promise<string | undefined> {
  return new Promise((resolve, reject) => {
    let body = Buffer.from('', 'utf-8');

    request
      .on('data', (chunk) => {
        body = Buffer.concat([body, chunk]);
      })
      .on('end', () => {
        if (body.length > 0) {
          resolve(body.toString('utf-8'));
        } else {
          resolve(undefined);
        }
      })
      .on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  try {
    console.log(req.url);
    const body = await readBody(req);
    const response = await route(req, res, body ? JSON.parse(body) : undefined);

    if (response) {
      res.write(
        JSON.stringify({
          type: 'success',
          data: response,
        })
      );
    }
  } catch (exception) {
    console.error(exception);
    if (exception instanceof HttpError) {
      res.statusCode = exception.statusCode;
      res.write(
        JSON.stringify({
          type: exception.errorCode,
          data: exception.data,
        })
      );
    } else {
      res.statusCode = 500;
      res.write(
        JSON.stringify({
          type: 'error',
          data: {
            message: exception.message,
          },
        })
      );
    }
  } finally {
    res.end();
  }
});

export const start = (port: number): http.Server => server.listen(port);
