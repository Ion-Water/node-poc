import { IncomingMessage, ServerResponse } from 'http';
import qs, { ParsedQs } from 'qs';
import { BadRequestError } from './errors';
export interface RequestData<Body = unknown> {
  querystring: ParsedQs;
  parameters: Record<string, string>;
  body: Body;
}

export interface RequestHandler<Body = unknown, Response = unknown> {
  (data: RequestData<Body>, req: IncomingMessage, res: ServerResponse):
    | Response
    | Promise<Response>;
}

type Route<Body = unknown, Response = unknown> = [string, RequestHandler<Body, Response>];

interface ParamaterizedRoute {
  route: Route;
  parameters: Record<string, string>;
}

export function routeKey(route: Route): string {
  return route[0];
}

export function routeHandler(route: Route): RequestHandler {
  return route[1];
}

let RouteMap = new Map<string, Route[]>();

RouteMap.set('GET', []);
RouteMap.set('POST', []);
RouteMap.set('PUT', []);
RouteMap.set('DELETE', []);

export async function route(
  req: IncomingMessage,
  res: ServerResponse,
  body: unknown
): Promise<unknown> {
  if (!req.method) {
    throw new Error('Request method missing');
  }

  if (!req.url) {
    throw new Error('Missing URL');
  }

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'OPTIONS, GET, POST, PUT, DELETE');
    res.statusCode = 204;
    return;
  }

  const methodMap = RouteMap.get(req.method);

  if (!methodMap) {
    throw new Error(`No matching HTTP method for [${req.method}]`);
  }

  const [path, query] = req.url.split('?');

  const url = cleanUrl(path);

  const matchRouteResult = matchRoute(url, methodMap);

  if (!matchRouteResult) {
    throw new Error(`No handler defined for [${req.method}] [${url}]`);
  }

  const { route, parameters } = matchRouteResult;

  return await routeHandler(route)({ parameters, querystring: qs.parse(query), body }, req, res);
}

export function matchRoute(url: string, routes: Route[]): ParamaterizedRoute | undefined {
  const urlPieces = url.split('/');

  for (const route of routes) {
    const key = routeKey(route);
    const routePieces = key.split('/');
    const parameters: Record<string, string> = {};

    if (routePieces.length !== urlPieces.length) {
      continue;
    }

    let isMatch = true;

    for (let i = 0; i < routePieces.length; i++) {
      const routePiece = routePieces[i];
      const urlPiece = urlPieces[i];

      if (routePiece === urlPiece) {
        continue;
      }

      const match = routePiece.match(/^:(\w+)/);

      if (!match) {
        isMatch = false;
        break;
      }

      const [, parameterName] = match;
      parameters[parameterName] = urlPiece;
    }

    if (isMatch) {
      return {
        route,
        parameters,
      };
    }
  }
}

export function cleanUrl(url: string): string {
  return (url.startsWith('/') ? url : `/${url}`).replace(/\/{2,}/g, '/');
}

export function createRoute<BODY = unknown, RESPONSE = unknown>(
  method: string,
  url: string,
  handler: RequestHandler<BODY, RESPONSE>
): void {
  const methodMap = RouteMap.get(method);

  if (!methodMap) {
    throw new Error(`Unable to route request of method [${method}]`);
  }

  if (!url) {
    throw new Error(`Unable to route an empty URL, use / for the root URL`);
  }

  RouteMap = RouteMap.set(method, [
    ...methodMap,
    [cleanUrl(url), handler as RequestHandler<unknown, unknown>],
  ]);
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
