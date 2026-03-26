export const typeDefs = `

  union UserOrErrorResult = User | ErrorResponse
  union BookOrErrorResult = Book | ErrorResponse
  union BooksOrErrorResult = [Book] | ErrorResponse

  type Query {
    getBooks: [Book!]!
    getBookById(id: ID!): BookOrErrorResult!
    getBooksByUserId(userId: ID!): BooksOrErrorResult!
    getBooksByAuthorOrTitle(title: String, author: String): BooksOrErrorResult!
  }
  
  type Mutation {
    createUserIfNotExists: UserOrErrorResult!
    createBook(title: String!, author: String!, description: String!, image: Bytes!, userId: ID!): BookOrErrorResult!
    changeBook(bookId: ID!, title: String!, author: String!, description: String!, image: Bytes!, userId: ID!): BookOrErrorResult!
    deleteBook(bookId: ID!): BookOrErrorResult!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: Int!
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    description: String!
    image: Bytes!
    userId: ID!
  }

  type ErrorResponse {
    code: String
    message: String!
  }

`;