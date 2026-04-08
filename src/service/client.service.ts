import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';


const httpLink = new HttpLink({
  uri: 'http://localhost:3770/graphql'
});

const authLink = new SetContextLink(({ headers }) => {
  const token = sessionStorage.getItem("userToken");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

export const clientService = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});
