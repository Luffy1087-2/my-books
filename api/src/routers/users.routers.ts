import { Router } from "express";

const usersRouters: Router = Router();

usersRouters.get('/', (req, res) => {
  // call the service to take data from the db
  // return it;
});

export default usersRouters;