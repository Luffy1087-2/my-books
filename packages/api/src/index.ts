'use strict';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.gql.js';
import { resolvers } from './graphql/resolvers.gql.js';
import dotenv from 'dotenv';
import { getUserTokenHandler } from './handlers/core.handler.js';
import { UserEntityModel } from '@my-books/core';
import { getEnvPath } from './utils/env.utils.js';

dotenv.config({ path: getEnvPath(import.meta.url), debug: true, encoding: 'utf8' });
const server = new ApolloServer<{ user: UserEntityModel | null }>({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => await getUserTokenHandler(req),
  listen: {
    port: 3770
  },
});

console.log(
  'graphql server listening to: ',
  url
);
