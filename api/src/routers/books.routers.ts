import { Router } from "express";

const booksRouters: Router = Router();

booksRouters.get('/', (req, res) => {
  // call the service to take data from the db
  // return it;
});

export default booksRouters;