'use strict';
import {ApolloServer} from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/typeDefs.ql';
import { getUserTokenHandler } from './handlers/core.handler';

const server = new ApolloServer({typeDefs, resolvers: {}});
const { url } = await startStandaloneServer(server, {
  context: async ({req}) => await getUserTokenHandler(req),
  listen: {
    port: 3770
  },
});

console.log(url);
