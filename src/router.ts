import { IncomingMessage } from 'http';

interface RequestHandler<T> {
  (req: IncomingMessage): T;
}

let RouteMap = new Map<string, Map<string, RequestHandler<unknown>>>();

RouteMap.set('GET', new Map<string, RequestHandler<unknown>>());
RouteMap.set('POST', new Map<string, RequestHandler<unknown>>());
RouteMap.set('PUT', new Map<string, RequestHandler<unknown>>());
RouteMap.set('DELETE', new Map<string, RequestHandler<unknown>>());

export async function route(req: IncomingMessage): Promise<unknown> {
  if (!req.method) {
    throw new Error('Request method missing');
  }

  if (!req.url) {
    throw new Error('Missing URL');
  }

  const methodMap = RouteMap.get(req.method);

  if (!methodMap) {
    throw new Error(`No matching HTTP method for [${req.method}]`);
  }

  const url = decodeURI(req.url.split('?')[0]);

  const handler = methodMap.get(url);

  if (!handler) {
    throw new Error(`No handler defined for [${req.method}] [${url}]`);
  }

  return await handler(req);
}

export function createRoute<T>(method: string, url: string, handler: RequestHandler<T>): void {
  const methodMap = RouteMap.get(method);

  if (!methodMap) {
    throw new Error(`Unable to route request of method [${method}]`);
  }

  if (!url) {
    throw new Error(`Unable to route an empty URL, use / for the root URL`);
  }

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  RouteMap = RouteMap.set(method, methodMap.set(cleanUrl, handler));
}
