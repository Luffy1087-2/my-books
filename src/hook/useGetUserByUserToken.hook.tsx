import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { UserEntityModel } from '@my-books/core';
import { useEffect } from 'react';

type GetUserByUserToken = {
  getUserByUserToken: UserEntityModel
};

const GET_USER_BY_USER_TOKEN = gql`
  query GetUserByUserToken {
    getUserByUserToken {
      ... on User {
        email
        id
        gId
        name
        avatarUrl
        role
      }
      ... on ErrorResponse {
        errorCode
        errorMessage
      }
    }
  }
`;

function shouldSkipQuery(user: UserEntityModel | null) {
  const userToken = sessionStorage.getItem('userToken');
  return userToken !== null
    && user !== null ||
    userToken === null
    && user === null;
}

export default function useGetUserByUserToken(user: UserEntityModel | null, setUserState: (user: UserEntityModel) => void) {
  const { data } = useQuery<GetUserByUserToken>(GET_USER_BY_USER_TOKEN, {
    skip: shouldSkipQuery(user)
  });

  useEffect(() => {
    if (data) setUserState(data.getUserByUserToken);
  }, [data]);
}
