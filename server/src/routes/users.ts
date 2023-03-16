import express from "express";
import { getUsers } from "../controllers/users";
import authorize from "../middleware/authorize";
const router = express.Router();

router.use(authorize);

router.route("/")
  .get(getUsers);

export default router;