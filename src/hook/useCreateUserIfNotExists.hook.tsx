import { ErrorLike, gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { UserEntityModel } from '@my-books/core';
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

export default function useCreateUserIfNotExists(
  googleAccessToken: string | null,
  setUserState: (user: UserEntityModel) => void
): {
  loading: boolean,
  error: ErrorLike | undefined,
  data: CreareOrGetUserResponse
} {
  const [createOrGetUser, { loading, data, error }] = useMutation<CreareOrGetUserResponse>(createOrGetMutation, {
    context: {
      headers: {
        'X-Google-Access-Token': googleAccessToken
      },
    },
    variables: {
    },
  });

  useEffect(() => {
    if (!googleAccessToken) return;
    createOrGetUser();
  },
    [googleAccessToken, createOrGetUser]
  );

  useEffect(() => {
    if (!data) return;
    const user = data.createUserIfNotExists;
    if (user.errorCode) throw new TypeError(user.errorMessage);
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
