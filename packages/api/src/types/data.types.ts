import { UserEntityModel } from '@my-books/core';
import { IncomingMessage, ServerResponse } from 'http';

export type ErrorResponse = {
  errorCode?: string,
  errorMessage?: string
}

export type ContextData = {
  user: UserEntityModel | null,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
};
