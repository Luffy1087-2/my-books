export type GoogleUserModel = {
  sub: string,
  family_name: string;
  given_name: string;
  email: string;
  avatarUrl: string,
  email_verified: boolean;
};

export type UserEntityModel = {
  id: number,
  gId: string,
  name: string,
  email: string,
  avatarUrl: string,
  role: 'admin' | 'user'
} & ErrorResponse;

export type ErrorResponse = {
  errorCode?: string,
  errorMessage?: string
}
