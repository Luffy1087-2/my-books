import { ErrorLike, gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { UserEntityModel } from '@my-books/core';

const createOrGetMutation = gql`
  mutation CreateOrGetUser {
    createUserIfNotExists {
      ... on User {
        id
        name
        email
        role
      }
      ... on ErrorResponse {
        message
      }
    }
  }
`;

export default function createUserIfNotExists(): {
  loading: boolean,
  data: UserEntityModel | null | undefined,
  error: ErrorLike | undefined,
  createOrGetUser: () => any
} | undefined {
  try {
    const [createOrGetUser, { loading, data, error }] = useMutation<UserEntityModel>(createOrGetMutation);
    createOrGetUser();

    return {
      loading,
      data,
      error,
      createOrGetUser
    };
  } catch (e: any) {
    console.log(e.message);
  }
}