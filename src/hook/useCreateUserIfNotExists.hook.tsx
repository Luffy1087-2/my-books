import { ErrorLike, gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { encryptToWebToken, UserEntityModel } from '@my-books/core';
import { useEffect } from 'react';

type CreareOrGetUserResponse = {
  createUserIfNotExists: UserEntityModel
} | null | undefined;

const createOrGetMutation = gql`
  mutation CreateOrGetUser {
    createUserIfNotExists {
      ... on User {
        email
        id
        gId
        name
        role
      }
      ... on ErrorResponse {
        code
        message
      }
    }
  }
`;

export default function useCreateUserIfNotExists(
  userToken: string | null,
  setUserState: (user: UserEntityModel) => void
): {
  loading: boolean,
  error: ErrorLike | undefined,
  data: CreareOrGetUserResponse
} {
  const [createOrGetUser, { loading, data, error }] = useMutation<CreareOrGetUserResponse>(createOrGetMutation);

  useEffect(() => {
    if (!userToken) return;
    sessionStorage.setItem('userToken', userToken);
    createOrGetUser();
  },
    [userToken, createOrGetUser]
  );

  useEffect(() => {
    if (!data) return;
    const user = data.createUserIfNotExists;
    const entityJsonString = JSON.stringify(user);
    const entityToken = encryptToWebToken(entityJsonString);
    sessionStorage.setItem('userToken', entityToken);
    setUserState(user);
  },
    [data, setUserState]
  );

  return {
    loading,
    data,
    error
  };
}
