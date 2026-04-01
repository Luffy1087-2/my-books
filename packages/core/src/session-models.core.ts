
export type GoogleUserModel = {
  sub: string,
  family_name: string;
  given_name: string;
  email: string;
  email_verified: boolean;
};

export type UserEntityModel = {
  id: number,
  name: string,
  email: string,
  role: 'admin' | 'user'
};
