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
        errorCode
        errorMessage
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
    // Token from google
    sessionStorage.setItem('userToken', userToken);
    createOrGetUser();
  },
    [userToken, createOrGetUser]
  );

  useEffect(() => {
    if (!data) return;
    const user = data.createUserIfNotExists;
    if (user.errorCode) throw new TypeError(user.errorMessage);
    const entityJsonString = JSON.stringify(user);
    const entityToken = encryptToWebToken(entityJsonString);
    // Override the Google token with the application token
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
