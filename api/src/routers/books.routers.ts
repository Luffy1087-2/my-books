import { Router } from "express";
import SelectQueryBuilder from "../db/builder/select-query.builder";
import DbClient from "../db/db.client";
import { Book } from "../types/tables";
import { cleanParam } from "../utils/helper";

const booksRouters: Router = Router();

booksRouters.get('/getBooks', async (req, res) => {
  const { author, title } = req.query;
  const books = await getBooks(
    cleanParam(author as string),
    cleanParam(title as string)
  );
  res.status(200).json(books);
});

booksRouters.get('/getBook/:id', async (req, res) => {
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
  const book = await DbClient.query(select);
  if (book.rowCount !== 1) return res.status(404).json({msg: 'book is not found'});
  res.status(200).json(book.rows[0]);
});

booksRouters.post('/addBook', (req, res) => {
  // call the service to take data from the db
  // upload file & put it into the db
  // return it;
  // check se il libro esiste by author & title
});


async function getBooks(author?: string, title?: string): Promise<Book[]> {
  const select = new SelectQueryBuilder('books')
    .withFields('id', 'title', 'author', 'description', 'img')
  if (shouldFilterByAuthorAndTitle(author, title)) {
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
      })
  }
  const data = await DbClient.query(select.build());
  return data.rows as Book[];
}

function shouldFilterByAuthorAndTitle(author?: string, title?: string): boolean {
  return author !== undefined &&
    author.length > 1 &&
    title !== undefined &&
    title.length > 0;
}

export default booksRouters;