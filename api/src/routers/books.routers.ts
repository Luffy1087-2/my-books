import { Router } from "express";
import multer from 'multer';
import { Book } from "../types/tables";
import { cleanParam } from "../utils/helper";
import SelectQueryBuilder from "../db/builder/select-query.builder";
import InsertQueryBuilder from "../db/builder/insert-query.builder";
import DbService from "../services/db.service";
import { ValidUser } from "../types/user";

const imgMiddleware = multer({ storage: multer.memoryStorage() }).single('img');
const booksRouters: Router = Router();

booksRouters.get('/books/get', async (req, res) => {
  const books = await getBooks();
  res.status(200).json(books);
});

booksRouters.get('/books/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({msg: 'book id is not valid'});
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'img')
    .withWhere({
      lOperand: 'id',
      operator: '=',
      rOperand: id.toString()
    })
    .build();
  const book = await DbService.query(select);
  if (book.rowCount !== 1) return res.status(404).json({msg: 'book is not found'});
  res.status(200).json(book.rows[0]);
});

booksRouters.get('/books/user/:userId', async (req, res) => {
  const id = Number(req.params.userId);
  if (isNaN(id)) return res.status(400).json({msg: 'book id is not valid'});
  const books = await getBooksByUserId(id);
  if (books.length === 0) return res.status(404).json({msg: 'user have no books'});
  res.status(200).json(books);
});

booksRouters.get('/books/filter/:author/:title', async (req, res) => {
  const author = req.params.author;
  const title = req.params.title;
  const books = await getFilteredBooksByAuthorOrTitle(author, title);
  if (books.length === 0) return res.status(404).json({msg: 'user have no books'});
  res.status(200).json(books);
});

booksRouters.post('/books/add', imgMiddleware, async (req, res) => {
  try {
    const user = res.locals.user as ValidUser;
    const imgBuffer = req.file;
    const { title, author, description } = req.body;
    const insert = new InsertQueryBuilder('books')
      .withFields('title', 'author', 'description', 'img', 'userId')
      .withValues('$1', '$2', '$3', '$4')
      .withReturning('id', 'title', 'author', 'description', 'img', 'userId')
      .build();
    const book = await DbService.query(insert, [
      title,
      author,
      description,
      imgBuffer,
      user.sub
    ]);
    res.status(201).json(book.rows[0]);
  } catch(e: any) {
    res.status(500).json({msg: 'error adding the book'});
  }
});

async function getBooks(): Promise<Book[]> {
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'img')
  const data = await DbService.query(select.build());
  return data.rows as Book[];
}

async function getBooksByUserId(userId: number): Promise<Book[]> {
    const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'img')
    .withWhere({
      lOperand: 'userId',
      operator: '=',
      rOperand: userId.toString()
    });
  const data = await DbService.query(select.build());
  return data.rows as Book[];
}

async function getFilteredBooksByAuthorOrTitle(author?: string, title?: string): Promise<Book[]> {
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'img')
  if (!shouldFilterByAuthorAndTitle(author, title)) return await getBooks();
  select
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

function shouldFilterByAuthorAndTitle(author?: string, title?: string): boolean {
  return author !== undefined &&
    author.length > 1 &&
    title !== undefined &&
    title.length > 0;
}

export default booksRouters;