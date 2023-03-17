import express from "express";
import { deleteUser, getUser, getUsers } from "../controllers/users";
import authorize from "../middleware/authorize";
const router = express.Router();

router.use(authorize);

router.route("/")
  .get(getUsers);

router.route("/:profileId")
  .get(getUser)
  .delete(deleteUser);

export default router;