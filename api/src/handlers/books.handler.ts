import { Book } from '../types/db.types.js';
import { ErrorResponse } from '../types/data.types.js';
import { cleanParam, getErrorModel, hasError } from '../utils/helper.js';
import SelectQueryBuilder from "../db/builder/select-query.builder.js";
import InsertQueryBuilder from "../db/builder/insert-query.builder.js";
import DbService from "../services/db.service.js";

export const getBooks = async (): Promise<Book[]> => {
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'image');
  const data = await DbService.query(select.build());
  return data.rows as Book[];
};

export const getBooksByUserId = async (userId: number): Promise<Book[] | ErrorResponse> => {
  if (isNaN(userId)) return getErrorModel('book id is not valid');
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'image')
    .withWhere({
      lOperand: 'userId',
      operator: '=',
      rOperand: userId.toString()
    });
  const data = await DbService.query(select.build());
  if (data.rowCount === 0) return getErrorModel('user have no books');
  return data.rows as Book[];
};

export const getBooksByAuthorOrTitle = async (author: string, title: string): Promise<Book[] | ErrorResponse> => {
  const books = await getFilteredBooksByAuthorOrTitle(cleanParam(author) ?? '', cleanParam(title) ?? '');
  if (hasError(books)) return books as ErrorResponse;
  if ((books as Book[]).length === 0) return getErrorModel('user have no books');
  return books;
};

export const getBookById = async (id: number): Promise<Book | ErrorResponse> => {
  if (isNaN(id)) return getErrorModel('book id is not valid');
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'image')
    .withWhere({
      lOperand: 'id',
      operator: '=',
      rOperand: id.toString()
    })
    .build();
  const book = await DbService.query(select);
  if (book.rowCount !== 1) return getErrorModel('book is not found');
  return book.rows[0] as Book;
};

export const addBook = async (
  id: string,
  title: string,
  author: string,
  description: string,
  imageBuffer: Uint8Array
): Promise<Book[] | ErrorResponse> => {
  try {
    const insert = new InsertQueryBuilder('books')
      .withFields('title', 'author', 'description', 'image', 'userId')
      .withValues('$1', '$2', '$3', '$4')
      .withReturning('id', 'title', 'author', 'description', 'image', 'userId')
      .build();
    const book = await DbService.query(insert, [
      title,
      author,
      description,
      imageBuffer,
      id // sub
    ]);
    return book.rows[0];
  } catch (e: any) {
    return getErrorModel('error adding the book');
  }
};

async function getFilteredBooksByAuthorOrTitle(author: string, title: string): Promise<Book[] | ErrorResponse> {
  if (!author.length && !title.length) return getErrorModel('author or title should be filled');
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'image')
    .withWhere({
      lOperand: 'author',
      operator: 'LIKE',
      rOperand: `%${author}%`,
      rLogicOperand: 'OR'
    })
    .withWhere({
      lOperand: 'UPPER(title)',
      operator: 'LIKE',
      rOperand: `%${title!.toUpperCase()}%`,
    });
  const data = await DbService.query(select.build());
  return data.rows as Book[];
}
