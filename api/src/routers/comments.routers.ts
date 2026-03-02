import { Router } from "express";

const commentsRouters: Router = Router();

commentsRouters.get('/', (req, res) => {
  // call the service to take data from the db
  // return it;
});

export default commentsRouters;