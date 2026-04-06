'use strict';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.gql.js';
import { resolvers } from './graphql/resolvers.gql.js';
import { getUserTokenHandler } from './handlers/core.handler.js';
import dotenv from 'dotenv';
import { getEnvPath } from './utils/helper.js';
import { GoogleUserModel, UserEntityModel } from '@my-books/core';

dotenv.config({ path: getEnvPath(import.meta.url), debug: true });
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
