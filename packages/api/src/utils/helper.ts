import { UserEntityModel } from '@my-books/core';
import { ErrorResponse } from "../types/data.types.js";

export function arrayToQueryValues(values: string[], wrapInQuotes: boolean = false): string {
  return values
    .reduce((p: string, c: string) => {
      const val = wrapInQuotes ? `${c}` : c;

      return `${p}${val}, `;
    },
      ''
    )
    .substring(0, -1);
}

export function cleanParam(param: string | undefined): string | undefined {
  if (!param) return undefined;
  const match = param!.trim().match(/[\w\s\.-]+/i);
  return match ? match[0] : undefined;
}

export function isUserEntityValid(user: UserEntityModel | null): boolean {
  return !!user
    && user != null
    && /^\d+$/i.test(user.id.toString())
    && typeof user.name === 'string'
    && /^\w+$/i.test(user.name);
}

export function hasError(data: any) {
  const error: ErrorResponse = data;
  return error
    && error.constructor === Object
    && error.message
    && error.message.length;
}

export function getErrorModel(message: string): ErrorResponse {
  try {
    return JSON.parse(message) as ErrorResponse;
  } catch {
    return {
      message: 'error parsing message',
      code: 'generic error'
    };
  }
}

export function exWithContext(message: string, ctx?: string) {
  const errModel = {
    msg: message,
    ctx
  }
  if (!ctx) delete errModel.ctx;

  return JSON.stringify(errModel);
}

export function trimLines(str: string) {
  return str
    .split('\n')
    .map(line => line.trim())
    .join('\n');
}
