import { UserEntityModel } from '@my-books/core';
import { ErrorResponse } from '../types/data.types.js';

export function hasError(data: any) {
  const error: ErrorResponse = data;
  return error
    && error.constructor === Object
    && error.errorMessage
    && error.errorMessage.length;
}

export function getErrorModel(message: string): ErrorResponse {
  try {
    return JSON.parse(message) as ErrorResponse;
  } catch {
    return {
      errorMessage: 'error parsing message, please check internet or db connection',
      errorCode: 'generic error'
    };
  }
}

export function isUserEntityValid(user: UserEntityModel | null): boolean {
  return !!user
    && user != null
    && /^\d+$/i.test(user.gId)
    && typeof user.name === 'string'
    && /^\w+$/i.test(user.name);
}

export function exceptionStringified(message: string, ctx?: string) {
  if (!ctx) {
    return JSON.stringify({ msg: message });
  }

  const errModel = { msg: message, ctx };
  return JSON.stringify(errModel);
}