import TypeDefsBuilder from "./builder/typeDefs.builder";

export const typeDefs = `

  union UserOrErrorResult = User | ErrorResponse
  union BookOrErrorResult = Book | ErrorResponse
  union BooksOrErrorResult = Books | ErrorResponse

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

const builder = new TypeDefsBuilder();
const addUnions = () => {

  builder.addUnion({
      name: 'UserOrErrorResult',
      models: [
        { type: 'User' },
        { type: 'ErrorResponse' }
      ]
  });

  builder.addUnion({
      name: 'BookOrErrorResult',
      models: [
        { type: 'Book' },
        { type: 'ErrorResponse' }
      ]
  });

  builder.addUnion({
    name: 'BooksOrErrorResult',
    models: [
      { type: 'Book' },
      { type: 'ErrorResponse' }
    ]
  });

};

const addTypes = () => {

  builder.addType({
    name: 'User',
    fields: {
      'id': { type: 'String', isMandatory: true},
      'name': { type: 'String', isMandatory: true},
      'email': { type: 'String', isMandatory: true},
      'role': { type: 'Int', isMandatory: true}
    }
  });

  builder.addType({
    name: 'Book',
    fields: {
      'id': { type: 'String', isMandatory: true },
      'title': { type: 'String', isMandatory: true },
      'author': { type: 'String', isMandatory: true },
      'description': { type: 'String', isMandatory: true },
      'image': { type: 'Bytes', isMandatory: true },
      'userId': { type: 'ID', isMandatory: true }
    }
  });

  builder.addType({
    name: 'Books',
    fields: {
      'books': { type: 'Book', isMandatory: true, isArray: true }
    }
  });

  builder.addType({
    name: 'ErrorResponse',
    fields: {
      'code': { type: 'String', isMandatory: false },
      'message': { type: 'String', isMandatory: true }
    }
  })

};

const addQueryFuncs = () => {

  builder.addQueryFunc('getBooks')
  builder.addReturnType({ type: 'Book', isMandatory: true, isArray: true });

  builder.addQueryFunc('getBookById');
  builder.addArgs({name: 'id', type: 'ID', isMandatory: true });
  builder.addReturnType({type: 'BookOrErrorResult', isMandatory: true });

  builder.addQueryFunc('getBooksByUserId');
  builder.addArgs({name: 'userId', type: 'ID', isMandatory: true });
  builder.addReturnType({type: 'BookOrErrorResult', isMandatory: true });

  builder.addQueryFunc('getBooksByAuthorOrTitle');
  builder.addArgs(
    {name: 'title', type: 'String' },
    {name: 'author', type: 'String' },
  );
  builder.addReturnType({type: 'BookOrErrorResult', isMandatory: true });

};

// addMutationFuncs

builder.addQueryFunc('getBooks')
builder.addReturnType({ type: 'Book', isMandatory: true });
const result = builder.build();