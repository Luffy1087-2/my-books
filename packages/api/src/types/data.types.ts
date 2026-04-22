import { UserEntityModel } from '@my-books/core';
import { IncomingMessage, ServerResponse } from 'http';

export type DBUser = {
  id: number,
  name: string,
  email: string,
  gId: string,
  u_role: 1 | 2
}

export type ErrorResponse = {
  errorCode?: string,
  errorMessage?: string
}

export type ContextData = {
  user: UserEntityModel | null,
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
};
