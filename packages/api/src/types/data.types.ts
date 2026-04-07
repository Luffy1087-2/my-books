
export type DBUser = {
  id: number,
  name: string,
  email: string,
  gId: string,
  u_role: 1 | 2
}

export type ErrorResponse = {
  code: string,
  message: string
}