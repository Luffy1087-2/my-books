import { ErrorLike, gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { encryptToWebToken, UserEntityModel } from '@my-books/core';
import { useEffect } from 'react';

type CreareOrGetUserResponse = {
  createUserIfNotExists: UserEntityModel
} | null | undefined;

const createOrGetMutation = gql`
  mutation CreateOrGetUser($googleToken: String!) {
    createUserIfNotExists(googleToken: $googleToken) {
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
  googleToken: string | null,
  setUserState: (user: UserEntityModel) => void
): {
  loading: boolean,
  error: ErrorLike | undefined,
  data: CreareOrGetUserResponse
} {
  const [createOrGetUser, { loading, data, error }] = useMutation<CreareOrGetUserResponse>(createOrGetMutation, {
    context: {
      headers: {
        'X-Auth-Bypass': 'true',
      },
    },
    variables: {
      googleToken: googleToken,
    },
  });

  useEffect(() => {
    if (!googleToken) return;
    createOrGetUser();
  },
    [googleToken, createOrGetUser]
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
