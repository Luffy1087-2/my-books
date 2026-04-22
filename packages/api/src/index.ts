'use strict';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.gql.js';
import { resolvers } from './graphql/resolvers.gql.js';
import { getUserTokenHandler } from './handlers/core.handler.js';
import { getEnvPath } from './utils/env.utils.js';
import { ContextData } from './types/data.types.js';

dotenv.config({ path: getEnvPath(import.meta.url), debug: true, encoding: 'utf8' });
const server = new ApolloServer<ContextData | {}>({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  context: async ({ req, res }) => await getUserTokenHandler(req, res),
  listen: {
    port: 3770
  },
});

console.log(
  'graphql server listening to: ',
  url
);
