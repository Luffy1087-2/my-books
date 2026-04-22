import { ApolloClient, InMemoryCache, ApolloLink, Observable, HttpLink } from '@apollo/client';
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

const afterwareLink = new ApolloLink((operation, forward) => {
  return new Observable((observer) => {
    const subscription = forward(operation).subscribe({
      next: (response) => {
        const context = operation.getContext();
        const httpResponse = context.response as Response | undefined;
        if (!httpResponse) return observer.next(response);
        const authHeader = httpResponse.headers.get('Authorization');
        if (!authHeader) return observer.next(response);
        const userToken = authHeader.replace('Bearer ', '');
        sessionStorage.setItem("userToken", userToken);
        observer.next(response);
      },
      error: (err) => observer.error(err),
      complete: () => observer.complete(),
    });

    return () => subscription.unsubscribe();
  });
});

export const clientService = new ApolloClient({
  link: ApolloLink.from([afterwareLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});
