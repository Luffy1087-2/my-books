import TypeDefsBuilder from './builder/typeDefs.builder.js';

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
      id: { type: 'String', isMandatory: true },
      gId: { type: 'String', isMandatory: true },
      name: { type: 'String', isMandatory: true },
      email: { type: 'String', isMandatory: true },
      avatarUrl: { type: 'String', isMandatory: true },
      role: { type: 'String', isMandatory: true }
    }
  });

  builder.addType({
    name: 'Book',
    fields: {
      'id': { type: 'String', isMandatory: true },
      'title': { type: 'String', isMandatory: true },
      'author': { type: 'String', isMandatory: true },
      'description': { type: 'String', isMandatory: true },
      'image': { type: 'Upload', isMandatory: true },
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
      'errorCode': { type: 'String', isMandatory: false },
      'errorMessage': { type: 'String', isMandatory: true }
    }
  });

};

const addQueryFuncs = () => {

  builder.addQueryFunc('getBooks')
  builder.addReturnType({ type: 'Book', isMandatory: true, isArray: true });

  builder.addQueryFunc('getBookById');
  builder.addArgs({ name: 'id', type: 'ID', isMandatory: true });
  builder.addReturnType({ type: 'BookOrErrorResult', isMandatory: true });

  builder.addQueryFunc('getBooksByUserId');
  builder.addArgs({ name: 'userId', type: 'ID', isMandatory: true });
  builder.addReturnType({ type: 'BooksOrErrorResult', isMandatory: true });

  builder.addQueryFunc('getBooksByAuthorOrTitle');
  builder.addArgs(
    { name: 'title', type: 'String' },
    { name: 'author', type: 'String' },
  );
  builder.addReturnType({ type: 'BookOrErrorResult', isMandatory: true });

  builder.addQueryFunc('getUserByUserToken');
  builder.addReturnType({ type: 'UserOrErrorResult', isMandatory: true });

};

const addMutationFuncs = () => {

  builder.addMutationFunc('createUserIfNotExists');
  builder.addReturnType({ type: 'UserOrErrorResult', isMandatory: true });

  builder.addMutationFunc('createBook');
  builder.addArgs(
    { name: 'title', type: 'String', isMandatory: true },
    { name: 'author', type: 'String', isMandatory: true },
    { name: 'description', type: 'String', isMandatory: true },
    { name: 'image', type: 'Upload', isMandatory: true },
    { name: 'userId', type: 'ID', isMandatory: true },
  );
  builder.addReturnType({ type: 'BookOrErrorResult', isMandatory: true });

  builder.addMutationFunc('changeBook');
  builder.addArgs(
    { name: 'bookId', type: 'ID', isMandatory: true },
    { name: 'title', type: 'String', isMandatory: true },
    { name: 'author', type: 'String', isMandatory: true },
    { name: 'description', type: 'String', isMandatory: true },
    { name: 'image', type: 'Upload', isMandatory: true },
    { name: 'userId', type: 'ID', isMandatory: true },
  );
  builder.addReturnType({ type: 'BookOrErrorResult', isMandatory: true });

  builder.addMutationFunc('deleteBook');
  builder.addArgs(
    { name: 'bookId', type: 'ID', isMandatory: true }
  );
  builder.addReturnType({ type: 'BookOrErrorResult', isMandatory: true });

};

builder.enableUploadType();
addUnions();
addTypes();
addQueryFuncs();
addMutationFuncs();

export const typeDefs = builder.build();