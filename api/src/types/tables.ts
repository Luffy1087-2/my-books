export type UserTable = {
  id: number,
  name: string,
  email: string,
  u_role: 0 | 1
};

export type Book = {
  id: number,
  author: string,
  title: string,
  description: string,
  img: string
}